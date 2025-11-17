import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password is required',
        },
        { status: 400 },
      );
    }

    // 8글자 이상 확인
    const isLengthValid = password.length >= 8;

    // 특수문자 포함 여부 확인 (영문, 숫자, 공백이 아닌 문자)
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/~`]/;
    const hasSpecialChar = specialCharRegex.test(password);

    const isValid = isLengthValid && hasSpecialChar;

    let message = '';
    if (!isLengthValid && !hasSpecialChar) {
      message = '비밀번호는 8글자 이상이고 특수문자를 포함해야 합니다.';
    } else if (!isLengthValid) {
      message = '비밀번호는 8글자 이상이어야 합니다.';
    } else if (!hasSpecialChar) {
      message = '비밀번호에 특수문자를 포함해야 합니다.';
    } else {
      message = '사용 가능한 비밀번호입니다.';
    }

    return NextResponse.json(
      {
        success: true,
        valid: isValid,
        message,
        checks: {
          length: isLengthValid,
          specialChar: hasSpecialChar,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check password',
      },
      { status: 500 },
    );
  }
}
