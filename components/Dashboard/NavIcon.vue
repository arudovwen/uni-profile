<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-4 h-4"
  >
    <!-- Apps Icon -->
    <template v-if="name === 'apps'">
      <path
        d="M6.66634 11.2999H4.13967C1.89301 11.2999 1.33301 10.7399 1.33301 8.49319V4.49319C1.33301 2.24652 1.89301 1.68652 4.13967 1.68652H11.1597C13.4063 1.68652 13.9663 2.24652 13.9663 4.49319"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.66699 14.3131V11.2998"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.33301 8.63379H6.66634"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.49316 14.3135H6.6665"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.6668 8.5329V12.3396C14.6668 13.9196 14.2735 14.3129 12.6935 14.3129H10.3268C8.74685 14.3129 8.35352 13.9196 8.35352 12.3396V8.5329C8.35352 6.9529 8.74685 6.55957 10.3268 6.55957H12.6935C14.2735 6.55957 14.6668 6.9529 14.6668 8.5329Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.4967 12.1663H11.5027"
        :stroke="iconColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Users Icon -->
    <template v-else-if="name === 'users'">
      <path
        d="M6.10671 7.24634C6.04004 7.23967 5.96004 7.23967 5.88671 7.24634C4.30004 7.19301 3.04004 5.89301 3.04004 4.29301C3.04004 2.65967 4.36004 1.33301 6.00004 1.33301C7.63337 1.33301 8.96004 2.65967 8.96004 4.29301C8.95337 5.89301 7.69337 7.19301 6.10671 7.24634Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.9402 2.66699C12.2335 2.66699 13.2735 3.71366 13.2735 5.00033C13.2735 6.26033 12.2735 7.28699 11.0268 7.33366C10.9735 7.32699 10.9135 7.32699 10.8535 7.33366"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.77348 9.70699C1.16014 10.787 1.16014 12.547 2.77348 13.6203C4.60681 14.847 7.61348 14.847 9.44681 13.6203C11.0601 12.5403 11.0601 10.7803 9.44681 9.70699C7.62014 8.48699 4.61348 8.48699 2.77348 9.70699Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.2266 13.333C12.7066 13.233 13.1599 13.0397 13.5332 12.753C14.5732 11.973 14.5732 10.6863 13.5332 9.90634C13.1666 9.62634 12.7199 9.43967 12.2466 9.33301"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Logs Icon -->
    <template v-else-if="name === 'logs'">
      <path
        d="M2.33301 11.9997V4.66634C2.33301 1.99967 2.99967 1.33301 5.66634 1.33301H10.333C12.9997 1.33301 13.6663 1.99967 13.6663 4.66634V11.333C13.6663 11.4263 13.6663 11.5197 13.6597 11.613"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.23301 10H13.6663V12.3333C13.6663 13.62 12.6197 14.6667 11.333 14.6667H4.66634C3.37967 14.6667 2.33301 13.62 2.33301 12.3333V11.9C2.33301 10.8533 3.18634 10 4.23301 10Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.33301 4.66699H10.6663"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.33301 7H8.66634"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Settings Icon -->
    <template v-else-if="name === 'settings'">
      <path
        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M1.33301 8.5863V7.41297C1.33301 6.71963 1.89967 6.1463 2.59967 6.1463C3.80634 6.1463 4.29967 5.29297 3.69301 4.2463C3.34634 3.6463 3.55301 2.8663 4.15967 2.51963L5.31301 1.85963C5.83967 1.5463 6.51967 1.73297 6.83301 2.25963L6.90634 2.3863C7.50634 3.43297 8.49301 3.43297 9.09967 2.3863L9.17301 2.25963C9.48634 1.73297 10.1663 1.5463 10.693 1.85963L11.8463 2.51963C12.453 2.8663 12.6597 3.6463 12.313 4.2463C11.7063 5.29297 12.1997 6.1463 13.4063 6.1463C14.0997 6.1463 14.673 6.71297 14.673 7.41297V8.5863C14.673 9.27963 14.1063 9.85297 13.4063 9.85297C12.1997 9.85297 11.7063 10.7063 12.313 11.753C12.6597 12.3596 12.453 13.133 11.8463 13.4796L10.693 14.1396C10.1663 14.453 9.48634 14.2663 9.17301 13.7396L9.09967 13.613C8.49967 12.5663 7.51301 12.5663 6.90634 13.613L6.83301 13.7396C6.51967 14.2663 5.83967 14.453 5.31301 14.1396L4.15967 13.4796C3.55301 13.133 3.34634 12.353 3.69301 11.753C4.29967 10.7063 3.80634 9.85297 2.59967 9.85297C1.89967 9.85297 1.33301 9.27963 1.33301 8.5863Z"
        :stroke="iconColor"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name: "apps" | "users" | "logs" | "settings";
  active?: boolean;
  color?: string;
  activeColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  color: "#475467",
  activeColor: "#1570EF",
});

const iconColor = computed(() => {
  return props.active ? props.activeColor : props.color;
});
</script>
