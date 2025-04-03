import React, { useState } from 'react';
import styled from 'styled-components';

function EditablePaymentTable() {
    const [installments, setInstallments] = useState([
        { percentage: '60%', description: 'On placement of order' },
        { percentage: '40%', description: 'Before Go live' }
    ]);

    const handleEdit = (index, field, value) => {
        const updatedInstallments = [...installments];
        updatedInstallments[index][field] = value;
        setInstallments(updatedInstallments);
    };

    const handleDelete = (index) => {
        const updatedInstallments = [...installments];
        updatedInstallments.splice(index, 1);
        setInstallments(updatedInstallments);
    };

    const handleAddRow = () => {
        setInstallments([...installments, { percentage: '', description: '' }]);
    };
    // style={{ maxHeight: "700px", overflowY: "auto" }}
    return (
        <Wrapper>
            <div className="" >
            <table className='table table-bordered mt-2'>
                <thead>
                    <tr>
                        <th colSpan="2">Payment Installment</th>
                        
                        <th className='btn-print'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {installments.map((installment, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    className='bordernone '
                                    value={installment.percentage}
                                    onChange={(e) => handleEdit(index, 'percentage', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    className='bordernone'
                                    value={installment.description}
                                    onChange={(e) => handleEdit(index, 'description', e.target.value)}
                                />
                            </td>
                            <td className='btn-print'>
                                <button className=' btn btn-danger btn-print' onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table></div>
            <button className=' btn btn-success btn-print mx-3' onClick={handleAddRow}>Add More Condition</button>
        </Wrapper>
    );
}

export default EditablePaymentTable;

const Wrapper = styled.div`
 .btn-print{
    @media print{
      display: none;
    }
  }
  .bordernone{
      
      @media print{
          border: none;
      }
    }
    /* input{
        width: 100%;
    } */

`
