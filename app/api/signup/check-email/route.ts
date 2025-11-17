import { NextRequest, NextResponse } from 'next/server';

import { getDataSource } from '@/config/data-source';

import { UserAccountRepository } from '@/database/repositories';

export async function POST(request: NextRequest) {
  const dataSource = await getDataSource();
  const userAccountRepository = new UserAccountRepository(dataSource.manager);

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 },
      );
    }

    const existingEmail = await userAccountRepository.findOne({ where: { email } });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          available: false,
          message: 'Email already exists',
        },
        { status: 409, statusText: 'Conflict' },
      );
    }

    return NextResponse.json(
      {
        success: true,
        available: true,
        message: 'Email is available',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email',
      },
      { status: 500 },
    );
  }
}
