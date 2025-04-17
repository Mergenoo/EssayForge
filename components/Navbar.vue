<template>
  <nav class="h-16 bg-[#121212] border-b border-white/10 py-3">
    <div
      :class="[
        'flex items-center justify-between',
        route.path === '/' ? 'max-w-screen-xl mx-auto px-6' : 'px-6',
      ]"
    >
      <NuxtLink to="/" class="text-2xl font-extrabold text-white tracking-wide">
        ESSAYFORGE
      </NuxtLink>

      <div class="flex items-center gap-6">
        <NuxtLink
          to="/plans"
          :class="[
            'relative px-2 py-1 text-sm transition',
            route.path === '/plans'
              ? 'text-primary font-medium after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:bg-primary after:rounded-full'
              : 'text-gray-300 hover:text-primary',
          ]"
        >
          Plans
        </NuxtLink>

        <template v-if="user">
          <div ref="dropdownRef" class="relative">
            <button
              @click="toggleDropdown"
              class="w-9 h-9 rounded-full overflow-hidden border-2"
              aria-label="Toggle profile dropdown"
            >
              <img
                :src="user.user_metadata?.avatar_url || fallbackAvatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
            </button>

            <client-only>
              <div
                v-show="showDropdown"
                class="absolute right-0 mt-2 w-56 bg-[#1e1e1e] text-white shadow-xl ring-1 ring-white/10 z-50"
              >
                <!-- Profile Header -->
                <div class="flex items-center gap-3 px-3 py-3">
                  <img
                    class="w-8 h-8 rounded-full"
                    :src="user.user_metadata?.avatar_url || fallbackAvatar"
                    alt="Avatar"
                  />
                  <p class="font-medium truncate text-sm">
                    {{ userProfile?.username || "User" }}
                  </p>
                </div>

                <!-- Menu Items -->
                <div class="flex flex-col py-1 text-sm font-light">
                  <NuxtLink
                    to="/home"
                    @click="toggleDropdown"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <i-lucide-home class="w-4 h-4" />
                    <span>Your work</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/settings/account"
                    @click="toggleDropdown"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <i-lucide-user class="w-4 h-4" />
                    <span>Manage account</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/settings/display"
                    @click="toggleDropdown"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <i-lucide-sliders-horizontal class="w-4 h-4" />
                    <span>Settings</span>
                  </NuxtLink>
                  <NuxtLink
                    to="/guide"
                    @click="toggleDropdown"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <i-lucide-book-open class="w-4 h-4" />
                    <span>Writing guide</span>
                  </NuxtLink>
                  <button
                    @click="signOut"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-[#2a2a2a] transition-colors text-white text-left w-full"
                  >
                    <i-lucide-log-out class="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>

                <!-- Footer -->
                <div
                  class="border-t border-gray-700 px-3 py-2 text-[11px] text-gray-500 flex justify-center gap-2"
                >
                  <NuxtLink
                    to="/terms"
                    @click="toggleDropdown"
                    class="hover:underline"
                    >Terms</NuxtLink
                  >
                  <span>·</span>
                  <NuxtLink
                    to="/privacy"
                    @click="toggleDropdown"
                    class="hover:underline"
                    >Privacy</NuxtLink
                  >
                </div>
              </div>
            </client-only>
          </div>
        </template>

        <template v-else>
          <NuxtLink
            to="/signin"
            :class="[
              'relative px-2 py-1 text-sm transition',
              route.path === '/signin'
                ? 'text-primary font-medium after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:bg-primary after:rounded-full'
                : 'text-gray-300 hover:text-primary',
            ]"
          >
            signin
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="bg-[#8F0EFC] text-white px-4 py-2 rounded-md hover:opacity-90 transition font-medium"
          >
            Get Started
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { UserProfile } from "~/types/users";
const client = useSupabaseClient();
const router = useRouter();
const route = useRoute();
const user = useSupabaseUser();

const fallbackAvatar = "https://api.dicebear.com/6.x/thumbs/svg?seed=user";
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const userProfile = ref<UserProfile | null>(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const signOut = async () => {
  const { error } = await client.auth.signOut();
  if (!error) router.push("/");
};
</script>
