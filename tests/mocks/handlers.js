import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(
    "http://ec2-16-16-249-120.eu-north-1.compute.amazonaws.com/api/v1/roles",
    () => {
      return HttpResponse.json([
        { roleId: 1, role: "Admin" },
        { roleId: 2, role: "User" },
      ]);
    }
  ),
];
