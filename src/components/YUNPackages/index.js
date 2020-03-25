import YjButton from './button/YJButton';
import YjInput from './input/YJInput';
import  YjDialog from './dialog/modal';
import YjSelect from './select/YJSelect';
import ListTable from './list-table/list-table';
import ListTableTitle from './list-table-title/list-table-title';
import TableHoner from './table-honer/table-honer';
import promptMessage from './promptMessage/promptMessage';


const components ={
  'YjButton': YjButton,
  'YjInput': YjInput,
  'YjDialog': YjDialog,
  'YjSelect': YjSelect,
  'ListTable':ListTable,
  'ListTableTitle':ListTableTitle,
  'TableHoner':TableHoner,
  "promptMessage": promptMessage
};

const YJComponent = {
  install(Vue) {
    for(let obj in components){
      Vue.component(obj, components[obj]);
    }
  },
};
export default YJComponent;
