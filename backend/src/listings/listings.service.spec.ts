import { Test, TestingModule } from "@nestjs/testing";
import { ListingsService } from "./listings.service";
import { PrismaService } from "../prisma/prisma.service";
import { Listing } from "@prisma/client";

describe("ListingsService", () => {
  let service: ListingsService;

  const mockPrisma = {
    listings: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all listings", async () => {
    const mockData: Listing[] = [
      {
        id: BigInt(1),
        seller_id: "user-1",
        title: "Old book",
        description: null,
        category_id: null,
        condition: null,
        price: 100,
        currency: "USD",
        status: "ACTIVE",
        location_lat: null,
        location_lon: null,
        views_count: 0,
        favorites_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        sold_at: null,
      },
    ];

    mockPrisma.listings.findMany.mockResolvedValueOnce(mockData);

    const result = await service.findAll();
    expect(result).toEqual(mockData);
  });

  it("should create a listing", async () => {
    const dto: Omit<Listing, "id"> = {
      seller_id: "user-2",
      title: "New phone",
      description: "Like new",
      category_id: null,
      condition: "USED",
      price: 200,
      currency: "USD",
      status: "ACTIVE",
      location_lat: null,
      location_lon: null,
      views_count: 0,
      favorites_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      sold_at: null,
    };

    const mockListing: Listing = { id: BigInt(2), ...dto };

    mockPrisma.listings.create.mockResolvedValueOnce(mockListing);

    const result = await service.create(dto);
    expect(result).toEqual(mockListing);
  });
});
