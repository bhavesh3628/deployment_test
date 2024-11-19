export type CreateFranchiseDTO = {
  name: string;
  city: string;
};

export type EditFranchiseDTO = Partial<CreateFranchiseDTO>;
