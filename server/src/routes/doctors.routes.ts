import { Router, Request, Response } from 'express';
import { prisma } from '../db.js';

export const doctorsRouter = Router();

// GET /api/doctors - Fetch doctors with optional query filters
doctorsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { specialty, search } = req.query;

    const whereClause: any = {};

    if (specialty && typeof specialty === 'string' && specialty !== 'all') {
      whereClause.specialty = {
        contains: specialty,
        mode: 'insensitive',
      };
    }

    if (search && typeof search === 'string' && search.trim()) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
        { hospital: { contains: search, mode: 'insensitive' } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' },
    });

    return res.json({ doctors, total: doctors.length });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ error: 'Failed to fetch doctors list' });
  }
});

// GET /api/doctors/:id - Fetch single doctor by ID
doctorsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        appointments: {
          where: { status: 'CONFIRMED' },
          select: { date: true, timeSlot: true },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.json({ doctor });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return res.status(500).json({ error: 'Failed to fetch doctor details' });
  }
});
