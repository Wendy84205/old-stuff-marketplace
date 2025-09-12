import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng ký tài khoản
  async signup(email: string, password: string, displayName: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        display_name: displayName,
      },
    });

    return {
      message: "Signup success",
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
      },
    };
  }

  // Đăng nhập
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // 🔑 Payload cho JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: "Login success",
      access_token: accessToken,
    };
  }

  // Đăng xuất (với JWT thuần thì client tự xoá token)
  logout() {
    return { message: "Logged out (client must delete token)" };
  }
}
