import { NextResponse } from "next/server";

type ApiResponse<T> = {
  status: "success" | "error";
  data?: T;
  message?: string;
};

export function successResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      status: "success",
      data,
      ...(message ? { message } : {}),
    },
    { status: 200 }
  );
}

export function createdResponse<T>(
  data: T,
  message?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      status: "success",
      data,
      ...(message ? { message } : {}),
    },
    { status: 201 }
  );
}

export function errorResponse(
  message: string,
  status = 400
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status }
  );
}

export function notFoundResponse(
  message = "Resource not found"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status: 404 }
  );
}

export function serverErrorResponse(
  message = "Internal server error"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status: 500 }
  );
}

export function unauthorizedResponse(
  message = "Unauthorized"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status: 401 }
  );
}

export function forbiddenResponse(
  message = "Forbidden"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      status: "error",
      message,
    },
    { status: 403 }
  );
}
