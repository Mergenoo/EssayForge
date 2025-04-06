<template>
  <div
    :class="[
      'flex flex-col items-center w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg',
      isFullscreen
        ? 'fixed inset-0 bg-secondary z-50 flex flex-col'
        : 'bg-secondary',
    ]"
  >
    <!-- Toolbar -->
    <div
      v-if="editor"
      class="flex gap-2 bg-gray-800 p-2 rounded-lg shadow-lg mb-3 w-full"
    >
      <button
        @click="editor.chain().focus().toggleBold().run()"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <Bold class="w-5 h-5" />
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <Italic class="w-5 h-5" />
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <Type class="w-5 h-5" />
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <List class="w-5 h-5" />
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <ListOrdered class="w-5 h-5" />
      </button>
      <button
        @click="saveEssay"
        class="p-2 rounded-md bg-primary text-white hover:bg-purple-700 transition-all"
      >
        <Save class="w-5 h-5" />
      </button>
      <button
        @click="toggleFullscreen"
        class="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-all"
      >
        <Fullscreen class="w-5 h-5" />
      </button>
    </div>

    <!-- Editor Content -->
    <div
      class="w-full bg-gray-900 p-4 shadow-lg rounded-lg min-h-[400px] text-white"
    >
      <EditorContent
        :editor="editor"
        class="prose w-full p-3 border border-gray-700 rounded-md min-h-[300px] bg-gray-800 text-white"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Type,
  List,
  ListOrdered,
  Save,
  Fullscreen,
} from "lucide-vue-next";

const editor = useEditor({
  extensions: [StarterKit, Underline],
  content: "<p>Start writing your essay...</p>",
  autofocus: true,
});

const isFullscreen = ref(false);


const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  document.body.classList.toggle("fullscreen-mode", isFullscreen.value);
};


const saveEssay = () => {
  localStorage.setItem("essayDraft", editor.value.getHTML());
  alert("Essay saved!");
};


onMounted(() => {
  const savedEssay = localStorage.getItem("essayDraft");
  if (savedEssay) {
    editor.value.commands.setContent(savedEssay);
  }
});


onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
