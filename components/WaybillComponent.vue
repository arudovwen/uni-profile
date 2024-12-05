<template>
  <div class="max-w-[600px] p-6 border-2 border-gray-400">
    <div class="flex justify-between items-center p-3">
      <img src="/assets/images/Oxide Pry-2.png" class="w-[112px] h-[25px]" />
      <span class="text-[20px] text-[#182230]">WAYBILL</span>
    </div>
    <div class="bg-[#E4E7EC] w-full h-[1px]"></div>
    <div class="flex flex-row justify-between items-center my-4">
      <TextSupport text="Date" subText="12/10/2024" />
      <TextSupport
        text="Waybill No"
        subText="#REF1234"
        containerClass="item-end text-right"
      />
    </div>
    <div class="flex flex-row justify-between items-center my-4">
      <TextSupport text="Pickup Location" subText="Gbagada, Lagos" />
      <TextSupport
        text="Vehicle Type & Tonnage"
        subText="EKY278TR"
        containerClass="item-end text-right"
      />
    </div>
    <div class="flex flex-row justify-between items-center my-4">
      <TextSupport
        text="Destination"
        subText="15, Freedom Way. Lekki Phase one 105102"
      />
      <TextSupport
        text="Delivery Personnel"
        subText="Alex Ekubo"
        containerClass="item-end text-right"
      />
    </div>

    <table
      class="w-full right-8 border border-[#667085] box-border border-spacing-[2px] rounded-[12px] overflow-hidden bg-[#667085]"
    >
      <thead class="rounded-[12px]">
        <tr class="text-gray-800 text-[10px] rounded-[12px]">
          <th
            class="border-[1px] border-[#667085] bg-[#E4E7EC] p-3 w-[40%] rounded-tl-[12px]"
          >
            Item Description / SKU
          </th>
          <th class="border-[1px] border-[#667085] bg-[#E4E7EC] p-3 w-[18%]">
            No of Units
          </th>
          <th class="border-[1px] border-[#667085] bg-[#E4E7EC] p-3">
            Unit Type (Carton, pieces, etc)
          </th>
          <th class="border-[1px] border-[#667085] bg-[#E4E7EC] p-3 w-[20%]">
            Remark
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Add table rows here -->
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
        <tr>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
          <td class="border bg-white border-[#667085] p-3"></td>
        </tr>
      </tbody>
    </table>
    <NameAndSign label="Driver's Name" />
    <NameAndSign label="Receiver's Name" />
  </div>
</template>

<script setup>
import TextSupport from "./TextSupport.vue";
</script>

<style lang="scss" scoped></style>
