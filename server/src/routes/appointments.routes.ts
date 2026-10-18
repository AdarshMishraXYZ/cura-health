import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';

export const appointmentsRouter = Router();

const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor ID is required'),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  patientName: z.string().min(2, 'Patient name is required'),
  patientAge: z.number().int().positive().optional(),
  patientGender: z.string().optional(),
  contactPhone: z.string().optional(),
  symptomsNote: z.string().default('General consultation'),
  consultationType: z.enum(['video', 'in-person']).default('video'),
  clinicalUrgency: z.enum(['routine', 'moderate', 'high_attention']).default('routine'),
});

// POST /api/appointments - Book appointment with concurrency lock & double-booking protection
appointmentsRouter.post('/', bookingLimiter, optionalAuth, async (req: Request, res: Response) => {
  try {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const {
      doctorId,
      date,
      timeSlot,
      patientName,
      patientAge,
      patientGender,
      contactPhone,
      symptomsNote,
      consultationType,
      clinicalUrgency,
    } = parsed.data;

    // Use a transactional write with slot verification to prevent race conditions / double bookings
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify doctor exists
      const doctor = await tx.doctor.findUnique({ where: { id: doctorId } });
      if (!doctor) {
        throw new Error('DOCTOR_NOT_FOUND');
      }

      // 2. Concurrency check: Ensure slot is not already taken
      const existingConflict = await tx.appointment.findFirst({
        where: {
          doctorId,
          date,
          timeSlot,
          status: 'CONFIRMED',
        },
      });

      if (existingConflict) {
        throw new Error('SLOT_ALREADY_BOOKED');
      }

      // 3. Create the confirmed appointment
      const newAppointment = await tx.appointment.create({
        data: {
          doctorId,
          patientId: req.user?.id || null,
          patientName,
          patientAge,
          patientGender,
          contactPhone,
          symptomsNote,
          date,
          timeSlot,
          consultationType,
          clinicalUrgency,
          status: 'CONFIRMED',
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialty: true,
              fee: true,
              hospital: true,
              avatar: true,
            },
          },
        },
      });

      return newAppointment;
    });

    return res.status(201).json({
      message: 'Appointment successfully confirmed',
      appointment: result,
    });
  } catch (error: any) {
    if (error?.message === 'SLOT_ALREADY_BOOKED') {
      return res.status(409).json({
        error: 'Conflict: This time slot was just booked by another patient. Please select another slot.',
      });
    }
    if (error?.message === 'DOCTOR_NOT_FOUND') {
      return res.status(404).json({ error: 'Selected doctor does not exist.' });
    }
    console.error('Appointment booking error:', error);
    return res.status(500).json({ error: 'Failed to complete appointment booking.' });
  }
});

// GET /api/appointments - Fetch appointments (Public or Doctor queue)
appointmentsRouter.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const doctorId = typeof req.query.doctorId === 'string' ? req.query.doctorId : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const where: any = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }
    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            fee: true,
            hospital: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ appointments, count: appointments.length });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
});

// GET /api/appointments/my - Fetch authenticated user's appointments
appointmentsRouter.get('/my', authenticate, async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { patientId: req.user!.id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            fee: true,
            hospital: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch personal appointments.' });
  }
});

// PATCH /api/appointments/:id/cancel - Cancel an appointment
appointmentsRouter.patch('/:id/cancel', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return res.json({
      message: 'Appointment successfully cancelled',
      appointment: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to cancel appointment.' });
  }
});
