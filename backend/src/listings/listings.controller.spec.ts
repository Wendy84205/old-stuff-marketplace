import { Test, TestingModule } from "@nestjs/testing";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";
import { Listing } from "@prisma/client";

describe("ListingsController", () => {
  let controller: ListingsController;
  let service: ListingsService;

  const now = new Date();

  const mockListing: Listing = {
    id: BigInt(1),
    seller_id: "user-1",
    title: "Old book",
    description: "A very old book",
    category_id: null,
    condition: "USED",
    price: 100,
    currency: "USD",
    status: "ACTIVE",
    location_lat: null,
    location_lon: null,
    views_count: 0,
    favorites_count: 0,
    chats_count: 0,
    created_at: now,
    updated_at: now,
    deleted_at: null,
    sold_at: null,
  };

  const mockService = {
    findAll: jest.fn().mockResolvedValue([mockListing]),
    findOne: jest.fn().mockResolvedValue(mockListing),
    create: jest.fn().mockResolvedValue(mockListing),
    update: jest.fn().mockResolvedValue(mockListing),
    remove: jest.fn().mockResolvedValue(mockListing),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingsController],
      providers: [{ provide: ListingsService, useValue: mockService }],
    }).compile();

    controller = module.get<ListingsController>(ListingsController);
    service = module.get<ListingsService>(ListingsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should return all listings", async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockListing]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should return one listing", async () => {
    const result = await controller.findOne("1");
    expect(result).toEqual(mockListing);
    expect(service.findOne).toHaveBeenCalledWith(BigInt(1));
  });

  it("should create a listing", async () => {
    const dto: Omit<Listing, "id"> = {
      seller_id: "user-1",
      title: "Old book",
      description: "A very old book",
      category_id: null,
      condition: "USED",
      price: 100,
      currency: "USD",
      status: "ACTIVE",
      location_lat: null,
      location_lon: null,
      views_count: 0,
      favorites_count: 0,
      chats_count: 0,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      sold_at: null,
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockListing);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("should update a listing", async () => {
    const dto: Partial<Listing> = { title: "Updated title" };
    const result = await controller.update("1", dto);
    expect(result).toEqual(mockListing);
    expect(service.update).toHaveBeenCalledWith(BigInt(1), dto);
  });

  it("should remove a listing", async () => {
    const result = await controller.remove("1");
    expect(result).toEqual(mockListing);
    expect(service.remove).toHaveBeenCalledWith(BigInt(1));
  });
});
