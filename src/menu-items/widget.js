// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { LineChartOutlined, IdcardOutlined, DatabaseOutlined } from '@ant-design/icons';

// icons
const icons = {
  LineChartOutlined,
  IdcardOutlined,
  DatabaseOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
  id: 'group-widget',
  title: <div>Acasă</div>,
  icon: icons.IdcardOutlined,
  type: 'group',
  children: [
    {
      id: 'data',
      title: <div>Anunțuri</div>,
      type: 'item',
      url: '/anunturi',
      icon: icons.DatabaseOutlined
    },
    {
      id: 'statistics',
      title: <div>Dashboard</div>,
      type: 'item',
      url: '/dashboard/general',
      icon: icons.IdcardOutlined
    },
    {
      id: 'chart',
      title: <div>Aplicare</div>,
      type: 'item',
      url: '/student/aplicare',
      icon: icons.LineChartOutlined
    }
  ]
};

export default widget;
