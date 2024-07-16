// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { handlerCustomerDialog } from '../api/customer';
import { NavActionType } from '../config';

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined,
  UserAddOutlined,
  GoldOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined,
  UserAddOutlined,
  GoldOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: <div>Administrativ</div>,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'customer-list',
      title: <div>Studenți</div>,
      type: 'item',
      icon: icons.UserAddOutlined,
      url: '/apps/studenti/list',
      actions: [
        {
          type: NavActionType.FUNCTION,
          label: 'Adăugați un student',
          function: () => handlerCustomerDialog(true),
          icon: icons.PlusOutlined
        }
      ]
    },
    {
      id: 'invoice',
      title: <div>Facturi</div>,
      url: '/apps/factura/dashboard',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      breadcrumbs: false,
      children: [
        {
          id: 'invoice-list',
          title: <div>Listă facturi</div>,
          type: 'item',
          url: '/apps/factura/list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'e-commerce',
      title: <div>Gestionare burse</div>,
      type: 'collapse',
      icon: icons.GoldOutlined,
      children: [
        {
          id: 'product-list',
          title: <div>Formatare semestru</div>,
          type: 'item',
          url: '/apps/burse/formatareSemestru'
        },
        {
          id: 'products',
          title: <div>Burse de la stat</div>,
          type: 'item',
          url: '/apps/burse/burseStat'
        },
        {
          id: 'product-details',
          title: <div>Burse din fonduri proprii</div>,
          type: 'item',
          url: '/apps/burse/burseFonduriProprii',
        }
      ],
    },
    {
      id: 'add-new-product',
      title: <div>Întrebări frecvente</div>,
      type: 'item',
      url: '/apps/burse/intrebari',
      icon: icons.FileTextOutlined
    }
  ]
};

export default applications;
