import * as api from './api';
import {
    dict,
    UserPageQuery,
    AddReq,
    DelReq,
    EditReq,
    compute,
    CreateCrudOptionsProps,
    CreateCrudOptionsRet
} from '@fast-crud/fast-crud';
import {request} from '/@/utils/service';
import {dictionary} from '/@/utils/dictionary';
import {successMessage} from '/@/utils/message';
import {auth} from '/@/utils/authFunction'
import {inject, nextTick, ref} from 'vue';

export const createCrudOptions = function ({crudExpose, context}: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const pageRequest = async (query: UserPageQuery) => {
        return await api.GetList(query);
    };
    const editRequest = async ({form, row}: EditReq) => {
        form.id = row.id;
        return await api.UpdateObj(form);
    };
    const delRequest = async ({row}: DelReq) => {
        return await api.DelObj(row.id);
    };
    const addRequest = async ({form}: AddReq) => {
        return await api.AddObj(form);
    };


    return {
        crudOptions: {
            request: {
                pageRequest,
                addRequest,
                editRequest,
                delRequest,
            },
            actionbar: {
                buttons: {
                    add: {
                        iconRight: '知识库',
                        show: auth('api_white_list:Create')
                    }
                }
            },
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 250,
                buttons: {
                    view: {
                        show: true,
                        iconRight: 'View',
                        type: 'text',
                        click: (ctx: any) => {
                            const {row} = ctx;
                            context!.repositoryChunkRef.value.drawer = true;
                            nextTick(() => {
                                console.log('row', row.id, row.name)
                                context!.repositoryChunkRef.value.setSearchFormData({form: {parent: row.id}});
                                context!.repositoryChunkRef.value.doRefresh();
                            });
                        },
                    },
                    edit: {
                        iconRight: 'Edit',
                        type: 'text',
                        show: auth("api_white_list:Update")
                    },
                    remove: {
                        iconRight: 'Delete',
                        type: 'text',
                        show: auth("api_white_list:Delete")
                    },
                },
            },
            form: {
                col: {span: 24},
                labelWidth: '60px',
                wrapper: {
                    is: 'el-dialog',
                    width: '800px',
                },
            },
            columns: {
                _index: {
                    title: '序号',
                    form: {show: false},
                    column: {
                        //type: 'index',
                        align: 'center',
                        width: '70px',
                        columnSetDisabled: true, //禁止在列设置中选择
                        //@ts-ignore
                        formatter: (context) => {
                            //计算序号,你可以自定义计算规则，此处为翻页累加
                            let index = context.index ?? 1;
                            let pagination: any = crudExpose!.crudBinding.value.pagination;
                            return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
                        },
                    },
                },
                name: {
                    title: '知识库名称',
                    sortable: true,
                    column: {
                        show: true,
                    },
                    search: {
                        show: true,
                        component: {
                            props: {
                                clearable: true,
                            },
                            placeholder: '请输入名称',
                        },
                    }
                },
                description: {
                    title: '描述',
                    sortable: false,
                    column: {
                        minWidth: 280,
                    }
                },
                chunk_size: {
                    title: '分块大小',
                    sortable: false,
                    type: 'number',
                    search: {
                        show: false,
                        component: {
                            props: {
                                clearable: true,
                            },
                            placeholder: '请输入',
                        },
                    },
                    column: {
                        minWidth: 120,
                    },
                    form: {
                        value: 100
                    }
                },
                repeat_size: {
                    title: '重复字符',
                    type: 'number',
                    column: {
                        minWidth: 120,
                    },
                    form: {
                        value: 0
                    }
                },
                store_address: {
                    title: '存储地址',
                    column: {
                        minWidth: 400,
                    },
                    form: {
                        show: false,
                        component: {
                            name: 'el-input',
                            props: {
                                clearable: true,
                            },
                        },
                    }
                },
                create_datetime: {
                    title: '创建时间',
                    type: 'datetime',
                    column: {
                        width: 180,
                    },
                    form: {
                        show: false,
                        component: {
                            props: {
                                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                            },
                        },
                    },
                }
            },
        },
    };
};
