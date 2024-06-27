import * as api from './api';
import {
    dict,
    UserPageQuery,
    AddReq,
    DelReq,
    EditReq,
    CrudOptions,
    CreateCrudOptionsProps,
    CreateCrudOptionsRet
} from '@fast-crud/fast-crud';
import {dictionary} from '/@/utils/dictionary';
import {Session} from "/@/utils/storage";

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
        const data = crudExpose!.getSearchFormData()
        const parent = data.parent
        form.parent = parent
        if (parent) {
            return await api.AddObj(form);
        } else {
            return undefined
        }
    };

    return {
        crudOptions: {
            request: {
                pageRequest,
                addRequest,
                editRequest,
                delRequest,
            },
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 200,
                buttons: {
                    view: {
                        show: false,
                    },
                    edit: {
                        iconRight: 'Edit',
                        type: 'text',
                    },
                    remove: {
                        iconRight: 'Delete',
                        type: 'text',
                    },
                },
            },

            columns: {

                'file-uploader': {
                    title: '文件上传',
                    key: 'document',
                    align: 'center',
                    form: { // 表单配置
                        component: {
                            name: 'el-upload',
                            props: {
                                action: 'http://localhost:8000/api/knowledge/repository/upload/', // 上传的接口地址
                                headers: {Authorization: 'JWT ' + Session.get('token')},
                                name: 'file', // 上传的文件字段名
                                multiple: false, // 是否支持多选文件
                                listType: 'picture-card', // 上传组件的类型，这里是图片预览卡形式
                                // onPreview: this.handlePreview, // 预览文件的回调
                                // onRemove: this.handleRemove, // 删除文件的回调
                                onSuccess: (res, file, fileList) => {
                                    console.log('upload success -> ', res, file, fileList)
                                    console.log('this -> ', )
                                },// 上传成功的回调
                                onError: (err, file, fileList) => {
                                    console.log('upload error -> ', err, file, fileList)
                                },
                            },
                            accept: ".txt,.doc,.docx",
                        }, // 使用 ElementUI 的上传组件
                    }
                },

                _index: {
                    title: '序号',
                    form: {show: false},
                    column: {
                        //type: 'index',
                        align: 'center',
                        width: '70px',
                        columnSetDisabled: true, //禁止在列设置中选择
                        formatter: (context) => {
                            //计算序号,你可以自定义计算规则，此处为翻页累加
                            let index = context.index ?? 1;
                            let pagination = crudExpose!.crudBinding.value.pagination;
                            // @ts-ignore
                            return ((pagination.currentPage ?? 1) - 1) * pagination.pageSize + index + 1;
                        },
                    },
                },
                name: {
                    title: '名称',
                    search: {
                        show: true,
                        component: {
                            props: {
                                clearable: true,
                            },
                        },
                    },
                    type: 'input',
                    form: {
                        rules: [
                            // 表单校验规则
                            {required: true, message: '名称必填项'},
                        ],
                        component: {
                            props: {
                                clearable: true,
                            },
                            placeholder: '请输入名称',
                        },
                    },
                },
                file_name: {
                    title: '文件名',
                },
                chunk_count: {
                    title: '分块数量',
                    type: 'number',
                    search: {
                        disabled: true,
                        component: {
                            props: {
                                clearable: true,
                            },
                        },
                    },
                    show: false,
                    form: {
                        show: false,
                        rules: [
                            // 表单校验规则
                            {required: true, message: '数据值类型必填项'},
                        ],
                        value: 0,
                        component: {
                            props: {
                                clearable: true,
                            },
                            placeholder: '请选择选择大小',
                        },
                        /* valueChange(key, value, form, { getColumn, mode, component, immediate, getComponent }) {
                            const template = vm.getEditFormTemplate('value')
                            // 选择框重新选择后，情况value值
                            if (!immediate) {
                                form.value = undefined
                            }
                            if (value === 0) {
                                template.component.name = 'el-input'
                            } else if (value === 1) {
                                template.component.name = 'el-input-number'
                            } else if (value === 2) {
                                template.component.name = 'el-date-picker'
                                template.component.props = {
                                    type: 'date',
                                    valueFormat: 'yyyy-MM-dd'
                                }
                            } else if (value === 3) {
                                template.component.name = 'el-date-picker'
                                template.component.props = {
                                    type: 'datetime',
                                    valueFormat: 'yyyy-MM-dd HH:mm:ss'
                                }
                            } else if (value === 4) {
                                template.component.name = 'el-time-picker'
                                template.component.props = {
                                    pickerOptions: {
                                        arrowControl: true
                                    },
                                    valueFormat: 'HH:mm:ss'
                                }
                            } else if (value === 5) {
                                template.component.name = 'd2p-file-uploader'
                                template.component.props = { elProps: { listType: 'text' } }
                            } else if (value === 6) {
                                template.component.name = 'dict-switch'
                                template.component.value = true
                                template.component.props = {
                                    dict: {
                                        data: [
                                            { label: '是', value: 'true' },
                                            { label: '否', value: 'false' }
                                        ]
                                    }
                                }
                            } else if (value === 7) {
                                template.component.name = 'd2p-cropper-uploader'
                                template.component.props = { accept: '.png,.jpeg,.jpg,.ico,.bmp,.gif', cropper: { viewMode: 1 } }
                            }
                        }, */
                    },
                },
                file_type: {
                    title: '文件类型',
                    type: 'dict-select',
                    dict: dict({
                        data: [
                            {value: 'txt', label: 'txt'},
                            {value: 'pdf', label: 'pdf'},
                            {value: 'doc', label: 'doc'},
                            {value: 'docx', label: 'docx'},
                            {value: 'xls', label: 'xls'},
                            {value: 'xlsx', label: 'xlsx'},
                            {value: 'ppt', label: 'ppt'},
                        ]
                    }),
                },
                import_time: {
                    title: '导入时间',
                    type: 'datetime',
                    search: {
                        disabled: true,
                        component: {
                            props: {
                                clearable: true,
                                type: 'daterange',
                                'range-separator': '至',
                                'start-placeholder': '开始日期',
                                'end-placeholder': '结束日期',
                            },
                        },
                    },
                    show: false,
                }
            },
            form: {
                col: {span: 24},
            }
        },
    };
};
