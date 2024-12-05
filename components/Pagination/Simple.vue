<template>
  <div
    v-if="totalPages"
    class="flex justify-between items-center relative z-[9] h-[64px] px-6"
    :class="wrapperClass"
  >
    <span class="text-xs md:text-sm text-[#475467]">
      Page <span>{{ current }}</span> to <span>{{ totalPages }}</span></span
    >
    <div class="flex gap-x-4">
      <button
        @click.prevent="changePage(prevPage)"
        :disabled="current === 1"
        :class="`${
          current === 1 ? ' opacity-50 cursor-not-allowed' : ''
        } border border-[#D0D5DD] rounded-[5px] text-xs md:text-sm px-4 py-2`"
      >
        <span class="text-xs md:text-sm">Previous</span>
      </button>
      <button
        @click.prevent="changePage(nextPage)"
        :disabled="current === totalPages"
        :class="`${
          current === totalPages ? ' opacity-50 cursor-not-allowed' : ''
        } border border-[#D0D5DD] rounded-[5px] text-xs md:text-sm px-4 py-2`"
      >
        <span class="text-xs md:text-sm">Next</span>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Simple-Pagination",

  props: {
    options: {
      type: Array,
      default: () => [{}],
    },

    enableInput: {
      type: Boolean,
      default: false,
    },
    enableText: {
      type: Boolean,
      default: false,
    },
    enableSearch: {
      type: Boolean,
      default: false,
    },
    enableSelect: {
      type: Boolean,
      default: false,
    },
    pageChanged: {
      type: Function,
    },

    current: {
      type: Number,
      default: 1,
    },
    perPageChanged: {
      type: Function,
    },
    total: {
      type: Number,
      default: 0,
    },

    pageRange: {
      type: Number,
      default: 2,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    textBeforeInput: {
      type: String,
      default: "Go to page",
    },

    paginationClass: {
      type: String,
      default: "default",
    },
    wrapperClass: {
      type: String,
      default: "justify-between",
    },
    searchClasss: {
      type: String,
      default: "default",
    },
    textAfterInput: {
      type: String,
      default: "Go",
    },
  },
  data() {
    return {
      input: "",
      input2: null,
    };
  },

  computed: {
    rangeStart: function () {
      var start = this.current - this.pageRange;

      return start > 0 ? start : 1;
    },
    pages: function () {
      var pages = [];

      for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i);
      }

      return pages;
    },
    rangeEnd: function () {
      var end = this.current + this.pageRange;

      return end < this.totalPages ? end : this.totalPages;
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage);
    },

    prevPage: function () {
      return this.current - 1;
    },
    nextPage: function () {
      return this.current + 1;
    },
  },
  methods: {
    hasLast: function () {
      return this.rangeEnd < this.totalPages;
    },
    hasFirst: function () {
      return this.rangeStart !== 1;
    },

    hasNext: function () {
      return this.current < this.totalPages;
    },
    hasPrev: function () {
      return this.current > 1;
    },
    customPerPageChange(page) {
      this.perPageChanged({ currentPerPage: page });
    },
    changePage: function (page) {
      if (this.pageChanged) {
        this.pageChanged({ currentPage: page });
      }
      if (page > 0 && page <= this.totalPages) {
        this.$emit("page-changed", page);
      }
    },
  },
});
</script>
<style scoped lang="scss">
.pagination {
  @apply flex items-center space-x-1 flex-wrap;
  li {
    a,
    div {
      @apply bg-transparent   text-[10px] sm:text-xs lg:text-xs md:text-sm font-normal rounded-lg leading-[16px] flex h-6 lg:h-10 w-6 lg:w-10 items-center justify-center transition-all duration-150;
      &.active {
        @apply bg-[#EFF1F5] text-[#182230] font-medium;
      }
    }
  }
  &.bordered {
    @apply border border-[#D8DEE6] rounded-[3px] py-1 px-2;
    li {
      @apply text-slate-500;
      &:first-child,
      &:last-child {
        button {
          @apply hover:bg-primary-500  hover:text-[#182230] transition duration-150 text-slate-500 h-10 w-10 flex items-center justify-center rounded;
        }
      }
      a,
      div {
        @apply bg-transparent text-slate-500;
        &.active {
          @apply bg-primary-500  text-[#182230];
        }
      }
    }
  }
  &.border-group {
    @apply border border-[#D8DEE6] rounded-[3px]  px-0 space-x-0;
    li {
      @apply border-r border-[#D8DEE5] h-full flex flex-col  justify-center px-3  last:border-none text-slate-500;
      a,
      div {
        @apply bg-transparent text-slate-500 dark:text-[#182230] h-auto w-auto;
        &.active {
          @apply dark:text-[#182230] text-lg;
        }
      }
    }
  }
}
</style>
