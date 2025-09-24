// // app/api/users/route.ts
// import ServiceHelper from "@/helper/service.helper";
// import { NextResponse } from "next/server";
// import axios from "axios";

// const service = new ServiceHelper();

// const handleError = (error: unknown) => {
//   // Check if error is AxiosError
//   if (axios.isAxiosError(error)) {
//     return NextResponse.json(
//       {
//         data: null,
//         message: error.response?.data?.message || error.message,
//         code: error.response?.status || 500,
//         success: "error",
//       },
//       { status: error.response?.status || 500 }
//     );
//   }

//   // Generic error fallback
//   return NextResponse.json(
//     { data: null, message: (error as Error).message || "Unknown error", code: 500, success: "error" },
//     { status: 500 }
//   );
// };

// export async function GET(req: Request) {
//   try {
//     const token = req.headers.get("authorization");

//     const data = await service.fetcher("/users", "GET", {
//       headers: token ? { Authorization: token } : {},
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error proxying GET /users:", error);
//     return handleError(error);
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const token = req.headers.get("authorization");

//     const data = await service.fetcher("/users", "POST", {
//       headers: token ? { Authorization: token } : {},
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return handleError(error);
//   }
// }
