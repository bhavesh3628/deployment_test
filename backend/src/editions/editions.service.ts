import { Injectable } from '@nestjs/common';
import { CreateEditionDTO } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';

@Injectable()
export class EditionsService {
  create(createEditionDto: CreateEditionDTO) {
    return 'This action adds a new edition';
  }

  findAll() {
    return `This action returns all editions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} edition`;
  }

  update(id: number, updateEditionDto: UpdateEditionDto) {
    return `This action updates a #${id} edition`;
  }

  remove(id: number) {
    return `This action removes a #${id} edition`;
  }
}
