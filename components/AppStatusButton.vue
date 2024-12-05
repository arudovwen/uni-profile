<template>
  <span
    :class="`px-[6px] py-1 text-xs rounded-[6px] flex gap-x-1 items-center border max-w-max font-semibold whitespace-nowrap capitalize ${Stats[status]?.className}`"
  >
    <!-- <AppIcon icon="octicon:dot-fill-24" /> -->
    <span class=""> {{ Stats[status]?.text }}</span>
    {{}}
  </span>
</template>

<script setup>
import { defineProps } from "vue";
import AppIcon from "~/components/AppIcon";

const props = defineProps(["status", "type", "stattype"]);
const StatusClass = {
  0: "text-[#B54708] bg-[#FFFAEB] border-[#FEDF89]",
  1: "text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]",
  2: "text-[#175CD3] bg-[#EFF8FF] border-[#B2DDFF]",
  3: "text-[#363F72] bg-[#F8F9FC] border-[#3E4784]",
  4: "text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]",
  5: "text-[#5925DC] bg-[#F4F3FF] border-[#D9D6FE]",
  6: "text-[#B42318] bg-[#FEF3F2] border-[#D9D6FE]",
};

const StatusText = {
  0: {
    text: "Pending",
    className: StatusClass[0],
  },
  1: {
    text: props.type == "verdict" ? "Approved" : "Completed",
    className: StatusClass[1],
  },
  2: {
    text: "Rejected",
    className: StatusClass[4],
  },
  3: { text: "Completed" },
  className: StatusClass[3],
  4: {
    text: "Rejected",
    className: StatusClass[4],
  },
  5: {
    text: "Shipped",
    className: StatusClass[5],
  },
};

const ShippingText = {
  0: {
    text: "Pending",
    className: StatusClass[0],
  },
  1: {
    text: "Partially Paid",
    className: StatusClass[1],
  },
  2: {
    text: "In Progress",
    className: StatusClass[1],
  },
  3: {
    text: "Paid",
    className: StatusClass[1],
  },
  4: {
    text: "In Transit",
    className: StatusClass[1],
  },
  5: {
    text: "Delivered",
    className: StatusClass[1],
  },
  6: {
    text: "Cancelled",
    className: StatusClass[6],
  },
};

const Driver = {
  0: {
    text: "Pending",
    className: StatusClass[0],
  },
  1: {
    text: "Active",
    className: StatusClass[1],
  },
  2: {
    text: "Inactive",
    className: StatusClass[4],
  },
};

const AdminVehicle = {
  0: {
    text: "Pending",
    className: StatusClass[0],
  },
  1: {
    text: "Active",
    className: StatusClass[1],
  },
  2: {
    text: "Inactive",
    className: StatusClass[4],
  },
};
const VehicleStatus = {
  0: {
    text: "Inactive",
    className: StatusClass[4],
  },
  1: {
    text: "Active",
    className: StatusClass[1],
  },
};
const VendorOrderRequest = {
  0: {
    text: "Pending",
    className: StatusClass[3],
  },
  1: {
    text: "Pending",
    className: StatusClass[3],
  },
  2: {
    text: "Accepted",
    className: StatusClass[1],
  },
  3: {
    text: "Rejected",
    className: StatusClass[4],
  },
  4: {
    text: "Assigned",
    className: StatusClass[1],
  },
  5: {
    text: "In Transit",
    className: StatusClass[2],
  },
  6: {
    text: "Fully Paid",
    className: StatusClass[1],
  },
  7: {
    text: "Partially Paid",
    className: StatusClass[1],
  },
  8: {
    text: "Delivered",
    className: StatusClass[1],
  },
  9: {
    text: "Cancelled",
    className: StatusClass[4],
  },
  10: {
    text: "Expired",
    className: StatusClass[0],
  },
};

const AdminOrderRequest = {
  0: {
    text: "Pending",
    className: StatusClass[3],
  },
  1: {
    text: "In Progress",
    className: StatusClass[3],
  },
  2: {
    text: "Accepted",
    className: StatusClass[1],
  },
  3: {
    text: "Rejected",
    className: StatusClass[4],
  },
  4: {
    text: "Assigned",
    className: StatusClass[1],
  },
  5: {
    text: "In Transit",
    className: StatusClass[2],
  },
  6: {
    text: "Fully Paid",
    className: StatusClass[1],
  },
  7: {
    text: "Partially Paid",
    className: StatusClass[1],
  },
  8: {
    text: "Delivered",
    className: StatusClass[1],
  },
  9: {
    text: "Cancelled",
    className: StatusClass[4],
  },
  10: {
    text: "Expired",
    className: StatusClass[0],
  },
};
const ClientOrderRequest = {
  0: {
    text: "Pending",
    className: StatusClass[3],
  },
  2: {
    text: "In Progress",
    className: StatusClass[3],
  },

  4: {
    text: "In Transit",
    className: StatusClass[2],
  },

  5: {
    text: "Delivered",
    className: StatusClass[1],
  },
  6: {
    text: "Cancelled",
    className: StatusClass[4],
  },
};
const WalletStatus = {
  0: {
    text: "Transaction",
    className: StatusClass[3],
  },
  1: {
    text: "Account Funding",
    className: StatusClass[1],
  },
  2: {
    text: "Withdrawal",
    className: StatusClass[4],
  },
  3: {
    text: "Charge",
    className: StatusClass[4],
  },
  4: {
    text: "Vendor Settlement",
    className: StatusClass[1],
  },
  5: {
    text: "Order Payment",
    className: StatusClass[1],
  },
  6: {
    text: "Order Debit",
    className: StatusClass[4],
  },
  7: {
    text: "Repayment",
    className: StatusClass[1],
  },
  8: {
    text: "Reversal",
    className: StatusClass[1],
  },
};
const LoanStatus = {
  0: {
    text: "pending",
    className: StatusClass[0],
  },
  1: {
    text: "active",
    className: StatusClass[2],
  },
  2: {
    text: "paid",
    className: StatusClass[1],
  },
};

const CreditStatus = {
  0: {
    text: "pending",
    className: StatusClass[0],
  },
  1: {
    text: "approved",
    className: StatusClass[1],
  },
  2: {
    text: "disbursed",
    className: StatusClass[1],
  },
  3: {
    text: "declined",
    className: StatusClass[4],
  },
  4: {
    text: "reviewed",
    className: StatusClass[3],
  },
};
const ActiveFinance = {
  0: {
    text: "Active",
    className: StatusClass[1],
  },
  1: {
    text: "Finished",
    className: StatusClass[5],
  },
};
const PaymentStatus = {
  0: {
    text: "Settlement",
    className: StatusClass[5],
  },
  1: {
    text: "Withdrawal",
    className: StatusClass[0],
  },
};
const Stats = computed(() => {
  if (props.stattype === "driver") {
    return Driver;
  }
  if (props.stattype === "vehicle") {
    return VehicleStatus;
  }
  if (props.stattype === "payment") {
    return PaymentStatus;
  }
  if (props.stattype === "shipping") {
    return ShippingText;
  }
  if (props.stattype === "admin-vehicle") {
    return AdminVehicle;
  }
  if (props.stattype === "vendor-order-request") {
    return VendorOrderRequest;
  }
  if (props.stattype === "admin-order-request") {
    return AdminOrderRequest;
  }
  if (props.stattype === "client-order-request") {
    return ClientOrderRequest;
  }
  if (props.stattype === "wallet") {
    return WalletStatus;
  }

  if (props.stattype === "active-finance") {
    return ActiveFinance;
  }
  if (props.stattype === "loan") {
    return LoanStatus;
  }
  if (props.stattype === "credit") {
    return CreditStatus;
  }
  return StatusText;
});
</script>
