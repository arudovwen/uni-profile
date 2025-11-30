import { it, expect, describe, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/vue";
import FilterBar from "~/components/catalog/FilterBar.vue";
import index from "~/pages/index.vue";
import * as prodServices from "~/services/productservices";
import { RouterLinkStub } from "@vue/test-utils";

const store = useProductStore();

describe("IndexPage", () => {
  vi.mock("../../../services/productservices", () => ({
    getMarkets: vi.fn().mockResolvedValue({
      data: {
        pageNumber: 1,
        pageSize: 200,
        total: 262,
        succeeded: true,
        message: null,
        errors: null,
        data: [
          {
            id: 65,
            imagePath: "print",
            title: " Printing & Packaging",
            productCount: 14,
            categoriesCount: 2,
            marketColor: "#F9CBE4",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/a1394d8a-7ef2-484b-941c-df08afa51b20.jpg",
          },
          {
            id: 64,
            imagePath: "paint-roller",
            title: "Paints & Coatings",
            productCount: 20,
            categoriesCount: 5,
            marketColor: "#E0F7B0",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/212047d0-6f1a-45eb-ab84-42a6f6cb18fd.jpg",
          },
          {
            id: 8,
            imagePath: "plug",
            title: "Electrical & Electronics",
            productCount: 2,
            categoriesCount: 5,
            marketColor: "#C9E2FA",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/2deb7c23-ba53-4ed7-b0ab-049b36243a88.jpg",
          },
          {
            id: 231,
            imagePath: "glass-water-droplet",
            title: "Water Treatment ",
            productCount: 3,
            categoriesCount: 0,
            marketColor: "#969696",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/ecb70ca2-73e5-4a51-acf7-1e520b7b039b.jpg",
          },
          {
            id: 230,
            imagePath: "industry",
            title: "Industrial",
            productCount: 17,
            categoriesCount: 1,
            marketColor: "string",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/9527460f-1eb2-47bf-874e-a7e361561dbc.jpg",
          },
          {
            id: 262,
            imagePath: "tractor",
            title: "Agrocarbon",
            productCount: 0,
            categoriesCount: 0,
            marketColor: "",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/9137f8cf-545e-471d-8908-275f5cfdfb9d.jpg",
          },
          {
            id: 4,
            imagePath: "wheat-awn",
            title: " Agriculture & Animal feed",
            productCount: 1,
            categoriesCount: 6,
            marketColor: "#BBE5AC",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/f3583450-eb1d-4210-bcea-02ba9677456c.jpg",
          },
          {
            id: 1,
            imagePath: "syringe",
            title: "Healthcare & Pharmaceuticals",
            productCount: 6,
            categoriesCount: 7,
            marketColor: "#A9CAFF",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/4926bf09-3e04-4c0e-aca6-2beba4708a07.jpg",
          },
          {
            id: 5,
            imagePath: "car",
            title: "Automotive & Transportation",
            productCount: 1,
            categoriesCount: 5,
            marketColor: "#D0C9FF",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/052f5e84-adfc-4ddd-832e-8405dae72e50.jpg",
          },
          {
            id: 7,
            imagePath: "bag-shopping",
            title: "Consumer goods",
            productCount: 16,
            categoriesCount: 2,
            marketColor: "#F6F396",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/4b0d0578-3a2a-4788-ad28-41c86d0fb7f0.jpg",
          },
          {
            id: 2,
            imagePath: "pump-medical",
            title: " Home & Personal Care",
            productCount: 3,
            categoriesCount: 6,
            marketColor: "#C8F6EE",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/9151a52a-5ba8-4ef7-9bb1-6d79b38b5de8.jpg",
          },
          {
            id: 9,
            imagePath: "wheat-awn",
            title: "Food & Nutrition",
            productCount: 1,
            categoriesCount: 4,
            marketColor: "#f4a950",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/89c41390-b138-49cf-b9f0-c4fbdd1223da.jpg",
          },
          {
            id: 3,
            imagePath: "tape",
            title: "Adhesives & Sealants",
            productCount: 0,
            categoriesCount: 8,
            marketColor: "#969696",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/0e9d4178-b7d5-4ad6-8bf7-853b050a20db.png",
          },
          {
            id: 282,
            imagePath: "syringe",
            title: "Test & Test",
            productCount: 2,
            categoriesCount: 4,
            marketColor: "",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/3ed4d48d-d6dc-4280-ac6c-915c16d2618f.png",
          },
          {
            id: 6,
            imagePath: "screwdriver-wrench",
            title: "Building & Construction",
            productCount: 1,
            categoriesCount: 1,
            marketColor: "#FDD0AF",
            bgUrl:
              "http://dev.proxy.oxidefinance.com/uploads/3bd43003-8a2e-42ff-bab5-0843c376822e.png",
          },
        ],
      },
    }),
    getProductsByTag: vi.fn().mockResolvedValue({
      data: {
        succeeded: true,
        message: null,
        errors: null,
        data: {
          pageNumber: 1,
          pageSize: 8,
          total: 6,
          succeeded: true,
          message: null,
          errors: null,
          data: [
            {
              id: "3379915000005147001",
              title: "Minority PrAkane",
              seller: null,
              price: 1500,
              optionCount: 2,
              packString: [
                {
                  package: {
                    id: "5bd37333-2919-4fd5-a202-3b2028bbe698",
                    title: "Plastic drum",
                  },
                  unit: "m3",
                  size: 100,
                  color: "Blue",
                  purity: "100",
                  amount: 1500,
                  purchaseAmount: 0,
                  isAvailable: false,
                },
                {
                  package: {
                    id: "afbcc156-b26c-4b96-8277-2b4f05125ae0",
                    title: "Metal drum",
                  },
                  unit: "m3",
                  size: 10,
                  color: "Green",
                  purity: "99",
                  amount: 1200,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "5bd37333-2919-4fd5-a202-3b2028bbe698",
                title: "Plastic drum",
              },
              packType: "Plastic drum",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/9e905f49-50d4-40ae-9b40-fa797d255756.jpg",
              isAvailable: true,
              customerId: "3379915000002081001",
              manufacturer: "BASF",
              unit: "m3",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "min/p&p/tes/sxn/riq/eng/100kg",
              pickUpLocationId: null,
            },
            {
              id: "3379915000005141005",
              title: "Fresprod",
              seller: null,
              price: 200,
              optionCount: 3,
              packString: [
                {
                  package: {
                    id: "1d8f8bd1-ff6c-4a40-8905-cba0da1e84b4",
                    title: "Metal drum",
                  },
                  unit: "truck",
                  size: 90,
                  color: null,
                  purity: null,
                  amount: 200,
                  purchaseAmount: 0,
                  isAvailable: false,
                },
                {
                  package: {
                    id: "c95eb83e-1927-4fd2-be97-b6e100b94808",
                    title: "Plastic drum",
                  },
                  unit: "g",
                  size: 90,
                  color: "",
                  purity: "",
                  amount: 0,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
                {
                  package: {
                    id: "c2e6a099-af43-4cd6-9311-1788528fe7cb",
                    title: "Cylinder",
                  },
                  unit: "g",
                  size: 900,
                  color: "",
                  purity: "",
                  amount: 900,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "1d8f8bd1-ff6c-4a40-8905-cba0da1e84b4",
                title: "Metal drum",
              },
              packType: "Metal drum",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/47d3e928-4ffc-4b6d-bd6b-88ff0ee95c35.jpg",
              isAvailable: true,
              customerId: "3379915000003144001",
              manufacturer: "BASF",
              unit: "truck",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "fre/a&af/agr/foa/jiu/ich/90truck",
              pickUpLocationId: null,
            },
            {
              id: "3379915000005149001",
              title: "Reacher 2.2",
              seller: null,
              price: 1000,
              optionCount: 2,
              packString: [
                {
                  package: {
                    id: "c2ff60e4-dbf2-46ae-b466-76d488f55f99",
                    title: "Plastic drum",
                  },
                  unit: "kg",
                  size: 5,
                  color: "Blue",
                  purity: "99",
                  amount: 1000,
                  purchaseAmount: 0,
                  isAvailable: false,
                },
                {
                  package: {
                    id: "90e9e3ab-37ab-48cd-80c5-77c7827743fd",
                    title: "Metal drum",
                  },
                  unit: "kg",
                  size: 5,
                  color: "white",
                  purity: "99",
                  amount: 1500,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "c2ff60e4-dbf2-46ae-b466-76d488f55f99",
                title: "Plastic drum",
              },
              packType: "Plastic drum",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/b9c6f47b-66ed-461e-92f8-23ff99b49001.jpg",
              isAvailable: true,
              customerId: "3379915000002081001",
              manufacturer: "BASF",
              unit: "kg",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "rea/p&p/tes/f9e/vm3/eng/5kg",
              pickUpLocationId: null,
            },
            {
              id: "3379915000003911001",
              title: "Genple",
              seller: null,
              price: 5000,
              optionCount: 1,
              packString: [
                {
                  package: {
                    id: "05d9f7a1-08b1-4c91-acbc-62eaf30d5c4d",
                    title: "Carton",
                  },
                  unit: "bag(s)",
                  size: 4,
                  color: null,
                  purity: null,
                  amount: 5000,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "05d9f7a1-08b1-4c91-acbc-62eaf30d5c4d",
                title: "Carton",
              },
              packType: "Carton",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/ffd3d069-aa44-4b7c-84d0-06d26b953e40.jpg",
              isAvailable: true,
              customerId: "3379915000002081001",
              manufacturer: "Phamazell",
              unit: "bag(s)",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "gen/e&e/sem/ooo/xxx/eng/4",
              pickUpLocationId: null,
            },
            {
              id: "3379915000003727001",
              title: "Defoamers",
              seller: null,
              price: 3000,
              optionCount: 2,
              packString: [
                {
                  package: {
                    id: "8fd29d42-9161-4a01-a78e-a49d12926e72",
                    title: "Cylinder",
                  },
                  unit: "kg",
                  size: 20,
                  color: "White",
                  purity: null,
                  amount: 3000,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
                {
                  package: {
                    id: "41e8aad7-9709-48dc-bce0-0956bfe7b3fd",
                    title: "Tank",
                  },
                  unit: "g",
                  size: 3000,
                  color: "",
                  purity: "",
                  amount: 100,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "8fd29d42-9161-4a01-a78e-a49d12926e72",
                title: "Cylinder",
              },
              packType: "Cylinder",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/ec112a4c-a73d-4316-b79c-e5b581da247d.jpg",
              isAvailable: true,
              customerId: "3379915000003722002",
              manufacturer: "Defoamers Inc",
              unit: "kg",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "def/i/oil/ooo/xxx/fra/20kg",
              pickUpLocationId: null,
            },
            {
              id: "3379915000004732001",
              title: "Testing New Product",
              seller: null,
              price: 2221,
              optionCount: 1,
              packString: [
                {
                  package: {
                    id: "fb464c94-1d6a-4dca-a88d-810bb9f37f3b",
                    title: "Carton",
                  },
                  unit: "g",
                  size: 12,
                  color: null,
                  purity: null,
                  amount: 2221,
                  purchaseAmount: 0,
                  isAvailable: true,
                },
              ],
              pack: {
                id: "fb464c94-1d6a-4dca-a88d-810bb9f37f3b",
                title: "Carton",
              },
              packType: "Carton",
              logo: null,
              converPhoto:
                "http://dev.proxy.oxidefinance.com/uploads/61081b95-0837-4f33-9d68-a35c84c3ae36.jpg",
              isAvailable: true,
              customerId: "3379915000002081001",
              manufacturer: "BASF",
              unit: "g",
              liked: false,
              hidePrice: false,
              created: null,
              sku: "tes/p&p/spe/2og/x08/eng/12",
              pickUpLocationId: null,
            },
          ],
        },
      },
    }),
  }));
  const sortPrice = vi.fn;
  const component = render(index, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  });
  it("Mounts without error", () => {
    expect(component.html()).toContain(
      "Discover and buy chemicals and raw materials all in one place"
    );
		
  });
});
