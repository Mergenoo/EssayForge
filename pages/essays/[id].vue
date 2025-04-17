<template>
  <div class="flex h-screen w-full overflow-hidden">
    <!-- Sidebar -->
    <sideline class="w-20" />

    <div
      class="transition-all duration-300 ease-in-out bg-secondary overflow-hidden"
      :class="ui.isOutlineOpen || ui.isRewriteOpen ? 'w-80' : 'w-0'"
    >
      <div v-if="ui.isOutlineOpen" class="h-full">
        <OutlinePanel />
      </div>
      <div v-else-if="ui.isRewriteOpen" class="h-full">
        <Rewrite />
      </div>
    </div>

    <div
      class="flex-1 transition-all duration-300 ease-in-out px-6 pt-4 overflow-y-auto"
    >
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
          :ref="(el) => setBlockText(el, block.data.text)"
          :class="[
            'outline-none w-full p-1 border-l-2 transition-colors duration-200',
            block.type === 'outlineTopic'
              ? 'font-semibold text-primary border-primary'
              : 'text-white border-transparent',
            highlight.activeBlockId === block.id
              ? 'bg-primary bg-opacity-50 p-2'
              : '',
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "~/types/supabase";
import sideline from "~/components/Sideline.vue";
import OutlinePanel from "~/components/Outline.vue";
import { useUIStore } from "~/src/store/ui";
import { useHighlightStore } from "~/src/store/highlight";

const highlight = useHighlightStore();
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const ui = useUIStore();

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
    .eq("id", essayId)
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

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const target = event.target as HTMLElement;

  if (
    (event.key === "Backspace" || event.key === "Delete") &&
    target.innerText.trim() === ""
  ) {
    event.preventDefault();

    if (content.value.length > 1) {
      content.value.splice(index, 1);

      nextTick(() => {
        const focusIndex = index > 0 ? index - 1 : 0;
        const prevBlock = content.value[focusIndex];
        const el = document.querySelector(`[data-id='${prevBlock.id}']`);
        if (el instanceof HTMLElement) {
          el.focus();
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      });
    }
  }

  if (event.key === "ArrowUp" && index > 0) {
    event.preventDefault();
    const prevBlock = content.value[index - 1];
    const el = document.querySelector(`[data-id='${prevBlock.id}']`);
    if (el instanceof HTMLElement) {
      el.focus();
    }
  }

  if (event.key === "ArrowDown" && index < content.value.length - 1) {
    event.preventDefault();
    const nextBlock = content.value[index + 1];
    const el = document.querySelector(`[data-id='${nextBlock.id}']`);
    if (el instanceof HTMLElement) {
      el.focus();
    }
  }
};

const clearDraft = () => {
  localStorage.removeItem(`draft-${essayId}`);
};

const handleTab = (event: KeyboardEvent, index: number) => {
  event.preventDefault();

  const nextBlock = content.value[index + 1];
  if (!nextBlock) return;

  const el = document.querySelector(`[data-id='${nextBlock.id}']`);
  if (el instanceof HTMLElement) {
    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(true);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
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
    .eq("id", essayId);

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

  if (content.value.length === 0) {
    content.value.push({
      id: uuidv4(),
      type: "paragraph",
      data: { text: "" },
    });
  }

  ui.closeOutline();
  ui.closeRewrite();
  clearDraft();
  loadEssay();
});

// @ts-ignore
definePageMeta({ middleware: "auth" });
</script>
