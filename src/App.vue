<script setup>
import sideMenu from '@/app/features/side-menu';

import login from '../src/app/login/login';

import { ref } from 'vue';

import UserCenter from '@/app/features/main-pages/user-center';

import {
  mdiShopping, mdiPlusThick, mdiCart, mdiBasket, mdiHistory, mdiClose
} from '@mdi/js';

const drawer = ref(null);

</script>

<template>
  <v-app id="inspire">
    <!--    侧边菜单栏-->
    <v-navigation-drawer
        color="#F4F4F4"
        v-model="drawer"
        app>
      <sideMenu></sideMenu>
    </v-navigation-drawer>
    <!--暗127,1,26     亮149,36,58   中间的127,0,25-->
    <v-app-bar
        height="60"
        app
        color="rgb(149,36,58)">
      <v-app-bar-nav-icon
          class="ml-3"
          color="#FFFFF0"
          @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <!--        登录-->
        <v-dialog
            transition="dialog-top-transition"
            max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <span
                class="font-size-28"
                style="color: #FFFFF0"
                v-bind="attrs"
                v-on="on">
            X
          </span>
          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-card-actions class="justify-end">
                <v-btn
                    text
                    @click="dialog.value = false">
                  <v-icon
                      size="30"
                      color="rgb(149,36,58)">{{ mdiClose }}
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <login></login>
            </v-card>
          </template>
        </v-dialog>
        <span
            class="font-size-26"
            style="color: #E0E4E7">
            App
          </span>
      </v-toolbar-title>
    </v-app-bar>
    <!--    主页面-->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="sass">
@import "@/sass/shinra/shinra-style"
</style>
