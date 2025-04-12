<template>
  <div class="max-w-3xl mx-auto p-6">
    <div
      v-for="(block, index) in content"
      :key="block.id"
      class="group relative flex items-start gap-2 mb-1"
    >
      <div
        class="w-6 mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center text-gray-400"
      >
        <button class="hover:text-gray-600" @click="insertBlockAfter(index)">
          +
        </button>
        <span class="text-sm cursor-move select-none">⋮⋮</span>
      </div>


      <div
        contenteditable
        :data-id="block.id"
        spellcheck="false"
        :ref="(el) => setBlockText(el, block.data.text)"
        :class="[
          'outline-none w-full p-1 border-l-2',
          block.type === 'outlineTopic'
            ? 'font-semibold text-green-400 border-green-500'
            : 'text-white border-transparent',
        ]"
        @input="onBlockInput($event, block.id)"
        @keydown.enter.prevent="insertBlockAfter(index)"
        @keydown.tab.prevent="handleTab($event)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "~/types/supabase";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();

const essayId = route.params.id as string;
const title = ref("");
const content = ref<
  {
    id: string;
    type: "paragraph" | "outlineTopic";
    data: { text: string };
  }[]
>([]);

type Block = {
  id: string;
  type: "paragraph" | "outlineTopic";
  data: { text: string };
};
const saving = ref(false);

const loadEssay = async () => {
  const { data } = await supabase
    .from("essays")
    .select("title, content")
    .eq("id", "4760f5c5-261b-4b2d-9c69-7e17af5c1b4c")
    .eq("user_id", user.value?.id)
    .single();

  if (data) {
    title.value = data.title;
    content.value = data.content ?? [];
  }
};

const onBlockInput = (event: Event, blockId: string) => {
  const el = event.target as HTMLElement;
  const block = content.value.find((b) => b.id === blockId);
  if (block) {
    block.data.text = el.innerText;
  }
};

const insertBlockAfter = (index: number) => {
  const newBlock: Block = {
    id: uuidv4(),
    type: "paragraph",
    data: { text: "" },
  };
  content.value.splice(index + 1, 0, newBlock);

  nextTick(() => {
    const el = document.querySelector(`[data-id='${newBlock.id}']`);
    if (!el || !(el instanceof HTMLElement)) return;

    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  });
};

const clearDraft = () => {
  localStorage.removeItem(`draft-${essayId}`);
};

const handleTab = (event: KeyboardEvent) => {
  event.preventDefault();

  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const tabNode = document.createTextNode("    "); // 4 spaces
  range.insertNode(tabNode);

  // Move caret after inserted spaces
  range.setStartAfter(tabNode);
  range.setEndAfter(tabNode);
  selection.removeAllRanges();
  selection.addRange(range);
};

const saveEssay = async () => {
  if (!user.value) return;
  saving.value = true;

  const { error } = await supabase
    .from("essays")
    .update({
      title: title.value,
      content: content.value,
    })
    .eq("id", "4760f5c5-261b-4b2d-9c69-7e17af5c1b4c");

  saving.value = false;

  if (!error) {
    clearDraft();
  }
};

const setBlockText = (
  el: Element | ComponentPublicInstance | null,
  text: string
) => {
  const element = (el as ComponentPublicInstance)?.$el ?? el;

  if (element instanceof HTMLElement && element.innerText !== text) {
    element.innerText = text;
  }
};

const saveDraft = useDebounceFn(() => {
  const draft = {
    title: title.value,
    content: content.value,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(`draft-${essayId}`, JSON.stringify(draft));
}, 500);

const debouncedSave = useDebounceFn(saveEssay, 1500);

watch(
  [title, content],
  () => {
    saveDraft();
    debouncedSave();
  },
  { deep: true }
);

onMounted(() => {
  const draftRaw = localStorage.getItem(`draft-${essayId}`);
  if (draftRaw) {
    const draft = JSON.parse(draftRaw);
    if (draft?.content?.length > 0) {
      content.value = draft.content;
      title.value = draft.title;
    }
  }
  clearDraft();
  loadEssay();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
