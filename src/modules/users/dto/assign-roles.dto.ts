import { IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class AssignRoleDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  role_id: number;
}
