import { defaultPropertyItems } from "~/utils/constants";

// @ts-ignore
export default function updateData(form, product, defaultPackagesAvailable, isLoading, route) {
  form.id = route.query.id;
  form.ProductId = route.query.id;
  form.pickUpLocationId = product.value.pickupLocationId;
  form.name = product.value.name;
  form.unit = product.value.packagesAvailable
    ? product.value.packagesAvailable[0]?.unit
    : "";
  form.manufacturer = product.value.manufacturer || [];
  form.markets = product.value.markets || [];
  form.marketApplications = product.value.marketApplications || [];
  form.marketSubapplications = product.value.marketSubapplications || [];
  form.technologies = product.value.technologies || [];
  form.techApplications = product.value.techApplications || [];
  form.techSubApplications = product.value.techSubApplications || [];
  form.description = product.value.description;
  form.gallery = product.value.gallery || [];
  form.price = product.value.price;
  form.sampleAvailable = product.value.sampleAvailable;
  form.packagesAvailable = product.value.packagesAvailable || defaultPackagesAvailable;
  form.packages = product.value.packages || [];
  form.hideProduct = product.value.hideProduct;
  form.hidePrice = product.value.hidePrice;
  form.productBrandName = product.value.productBrandName;
  form.documents = product.value.documentInfoModels || [];
  form.productExperts = product.value.productExperts || [];
  form.productQuestions = product.value.productQuestions || [];
  form.tags = product.value.tags || [];
  form.supplierId = product.value.supplierId;
  form.propertyItems =
    product.value.propertyItems?.propertyItems &&
    Object.keys(product.value.propertyItems.propertyItems).length
      ? product.value.propertyItems.propertyItems
      : defaultPropertyItems;
  form.documentproperties = [
    {
      text: "Material safety data sheet (MSDS)",
      item: "Info such as the chemical properties.",
      value: "Material safety data sheet (MSDS)",
    },
    {
      text: "Certificate of analysis (COA)",
      item: "Certificate of analysis of product.",
      value: "Certificate of analysis (COA)",
    },
    {
      text: "Technical data sheet (TDS)",
      item: "Document with technical data of product.",
      value: "Technical data sheet (TDS)",
    },
    {
      text: "Other",
      item: "Other types of product documents.",
      value: "other",
    },
  ];
  form.properties = product.value?.propertyItems?.properties || [];
  form.propertyValueList = product.value?.propertyItems?.propertyValueList || [];
  isLoading.value = false;
}