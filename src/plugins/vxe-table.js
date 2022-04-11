import XEUtils from 'xe-utils'
import {
    VXETable,
    Grid,
    Edit,
    Export,
    Header,
    Validator,
    Icon,
    Column,
    Table,
    Tooltip,
    Toolbar,
    Input,
    Button,
    Form,
    FormItem,
    Pager,
    Select,
    Radio,
    RadioGroup,
    RadioButton,
    Modal
} from 'vxe-table'
import zhCNLocat from 'vxe-table/es/locale/lang/zh-CN'

// 全局默认参数
VXETable.setup({
    version: 0,
    zIndex: 100,
    table: {
        autoResize: true
    },
    Icon: [
        Button
    ]
})

// 导入默认的国际化（如果项目中使用多语言，则应该导入到 vue-i18n 中）
VXETable.setup({
    i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCNLocat, key), args)
})

export function useTable(app) {
    app.use(Header)
        .use(Icon).use(Column).use(Grid)
        .use(Edit).use(Validator).use(Export)
        .use(Tooltip).use(Input).use(Toolbar)
        .use(Button).use(Pager).use(Select)
        .use(Modal).use(Form).use(FormItem)
        .use(Radio).use(RadioGroup).use(RadioButton)
        .use(Table)
}
