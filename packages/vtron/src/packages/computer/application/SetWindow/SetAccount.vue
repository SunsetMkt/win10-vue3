<template>
  <div class="container">
    <div class="nav">
      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(index)"
          :class="{ active: index === activeIndex }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="setting">
      <div v-if="0 === activeIndex">
        <div class="setting-item">
          <h1 class="setting-title">{{ i18n('account.info') }}</h1>
        </div>
        <div class="setting-item">
          <label> {{ i18n('account') }} </label>
          <WinInput v-model="account" placeholder="" />
        </div>
        <div class="setting-item">
          <label> {{ i18n('password') }} </label>
          <WinInput v-model="password" placeholder="" type="password" />
        </div>

        <div class="setting-item">
          <label></label>
          <WinButton @click="submit">{{ i18n('confirm') }} </WinButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WinButton from '@packages/components/WinButton.vue';
import { inject, ref } from 'vue';
import { System } from '@packages/kernel';
import { i18n } from '@/packages/computer/i18n';
import { WinInput } from '@/packages/plug';
import { Dialog } from '@/packages/services';

const system = inject<System>('system')!;

const items = [i18n('account.info')];

const activeIndex = ref(0);

// const modelvalue = ref(system.getConfig('lang'));
const password = ref('');
const account = ref(localStorage.getItem('vtron-username') || '');

const selectItem = (index: number) => {
  activeIndex.value = index;
};

async function submit() {
  //   await system.setConfig('lang', modelvalue.value);
  localStorage.setItem('vtron-username', account.value);
  localStorage.setItem('vtron-password', password.value);

  system
    .createDialog()
    .showMessageBox({
      message: i18n('save.success'),
      title: i18n('account'),
      type: 'info',
    })
    .then(() => {
      system?.restart();
    });
}
</script>
<style scoped>
@import './setStyle.css';
</style>
