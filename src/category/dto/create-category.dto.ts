import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { categoryname } from "../enums/category.enum";

export class CreateCategoryDto {
  @ApiProperty({ 
    description: "Enter Category name",
     example: "Chocolate Cake"
     })
  @IsNotEmpty()
  @IsEnum(categoryname)
  category_name: categoryname;
}
