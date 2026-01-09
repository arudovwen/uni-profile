<template>
  <div>
    <h2>Users</h2>
    <table class="users-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <UserStatusBadge :status="user.status" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserStatusBadge from './UserStatusBadge.vue';

const users = ref([
  { id: 1, name: 'Jane Cooper', email: 'jane.cooper@example.com', status: 'Active' },
  { id: 2, name: 'John Smith', email: 'john.smith@example.com', status: 'Pending Invite' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', status: 'Inactive' },
]);
</script>

<style scoped>
.users-table {
  width: 100%;
  border-collapse: collapse;
}
.users-table th, .users-table td {
  border: 1px solid #e0e0e0;
  padding: 12px 16px;
  text-align: left;
}
.users-table th {
  background-color: #f9fafb;
}
</style>