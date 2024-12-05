<template>
  <div
    class="grid grid-cols-1 max-h-[70vh] overflow-y-auto"
    v-if="sortedNotifications.length"
  >
    <div class="mb-2" v-for="(notification, i) in sortedNotifications" :key="i">
      <h5 class="text-[11px] sm:text-xs text-[#ABABAB] py-2 uppercase">
        {{ getDay(notification.date) }}
      </h5>
      <div class="grid grid-cols-1 gap-y-2">
        <div
          class="bg-white border-t border-[#F4F5F6]"
          v-for="(n, v) in notification.content"
          :key="v"
        >
          <Info
            :url="n.url"
            :type="n.notificationType"
            :text="n.message"
            :time="getDate(n.notificationDate)"
            :id="n.id"
            :isViewed="n.isViewed"
          />
        </div>
      </div>
    </div>
  </div>
  <EmptyData v-else title="No new notification" />
</template>
<script setup>
import Info from "./InfoType.vue";
import { inject, computed } from "vue";
import moment from "moment";

const selectedOption = inject("selectedOption");
const notifications = inject("notifications");
var REFERENCE = moment(); // fixed just for testing, use moment();
var TODAY = REFERENCE.clone().startOf("day");
var YESTERDAY = REFERENCE.clone().subtract(1, "days").startOf("day");

function isToday(momentDate) {
  return moment(new Date(momentDate)).isSame(TODAY, "d");
}

function isYesterday(momentDate) {
  return moment(new Date(momentDate)).isSame(YESTERDAY, "d");
}

function getDay(val) {
  if (isToday(val)) {
    return "Today";
  }
  if (isYesterday(val)) {
    return "Yesterday";
  }
  return moment(new Date(val)).format("ll");
}
function getDate(val) {
  if (isToday(val)) {
    return moment(val).fromNow();
  }

  return moment(new Date(val)).format("ll");
}
const filteredNotification = computed(() => {
  if (!selectedOption.value.length) return notifications.value;
  return notifications.value.filter((item) =>
    selectedOption.value.includes(item.notificationType)
  );
});

const sortedNotifications = computed(() => {
  let mynotifications = [];
  if (!notifications) return [];
  let durations = filteredNotification.value.map((i) =>
    moment(new Date(i.notificationDate)).format("l")
  );

  let newSet = new Set([...durations]);
  let durationArr = Array.from(newSet);

  durationArr.forEach((n) => {
    let newobj = {
      date: n,
      content: notifications.value.filter((d) => {
        return moment(new Date(n)).isSame(
          moment(new Date(d.notificationDate)),
          "date"
        );
      }),
    };
    mynotifications.push(newobj);
  });
  return mynotifications || [];
});
</script>
