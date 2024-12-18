import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EditionService } from './editions.service';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDTO } from './dto/update-edition.dto';
@Controller('editions')
export class EditionsController {
  constructor(private readonly editionsService: EditionService) {}

  @Post()
  async create(@Body() createEditionDto: CreateEditionDTO) {
    const addedEdition = await this.editionsService.create(createEditionDto);
    return addedEdition;
  }

  @Get()
  findAll() {
    return this.editionsService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEditionDTO: UpdateEditionDTO) {
    return this.editionsService.edit(id, updateEditionDTO);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.editionsService.delete(id);
  }
}
