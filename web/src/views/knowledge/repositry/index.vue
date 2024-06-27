<template>
  <fs-page>
    <fs-crud ref="crudRef" v-bind="crudBinding"></fs-crud>
  </fs-page>
  <repository-chunk ref="repositoryChunkRef"></repository-chunk>
</template>

<script lang="ts" setup name="repository">
import {ref, onMounted, defineAsyncComponent} from 'vue';
import {useFs} from '@fast-crud/fast-crud';
import {createCrudOptions} from './crud';

const repositoryChunk = defineAsyncComponent(() => import('./chunk/index.vue'));
const repositoryChunkRef = ref();

const {crudBinding, crudRef, crudExpose} = useFs({createCrudOptions, context: {repositoryChunkRef}});

// 页面打开后获取列表数据
onMounted(() => {
  crudExpose.doRefresh();
});
</script>
