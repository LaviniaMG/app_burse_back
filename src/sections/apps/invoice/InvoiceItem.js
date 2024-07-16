'use client';;
import PropTypes from 'prop-types';

// project import
import InvoiceField from './InvoiceField';

// ==============================|| INVOICE - ITEMS ||============================== //

const InvoiceItem = ({ id, name, description, qty, price, onDeleteItem, onEditItem, index, Blur, errors, touched }) => {
  

  const textFieldItem = [
    { placeholder: '', label: 'price', type: 'number', name: `invoice_detail.${index}.price`, id: id + '_price', value: price }
  ];

  return (
    <>
      {textFieldItem.map((item) => {
        return (
          <InvoiceField
            onEditItem={(event) => onEditItem(event)}
            onBlur={(event) => Blur(event)}
            cellData={{
              placeholder: item.placeholder,
              name: item.name,
              type: item.type,
              id: item.id,
              value: item.value,
              errors: item.errors,
              touched: item.touched
            }}
            key={item.label}
          />
        );
      })}

  
       </>
  );
};

InvoiceItem.propTypes = {
  id: PropTypes.any,
  name: PropTypes.string,
  description: PropTypes.string,
  qty: PropTypes.number,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  index: PropTypes.number,
  Blur: PropTypes.func,
  errors: PropTypes.object,
  touched: PropTypes.object
};

export default InvoiceItem;
