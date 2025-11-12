import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/config/data-source";
import { User, UserAccount } from "@/database/entities";
import { UserRepository } from "@/database/repositories";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User).extend(UserRepository);

    const users = await userRepository.find();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, nickname, email, password } = body;

    if (!username || !nickname || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: username, nickname, email, password",
        },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    const userAccountRepository = dataSource.getRepository(UserAccount);

    const existingEmail = await userAccountRepository.findOne({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists",
        },
        { status: 400 }
      );
    }

    const user = userRepository.create({
      username,
      nickname,
    });

    const savedUser = await userRepository.save(user);

    const userAccount = userAccountRepository.create({
      userId: savedUser.id,
      email,
      password,
    });

    await userAccountRepository.save(userAccount);

    return NextResponse.json(
      {
        success: true,
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create user",
      },
      { status: 500 }
    );
  }
}
