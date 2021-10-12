import React,{useEffect,useState} from 'react';
import {Button, Space} from 'antd';

export const Pagination = ({showPerPage,onPaginationChange,total}) => {

  const [counter,setCounter]= useState(1);

  useEffect(()=>{
    const value= showPerPage* counter;
    onPaginationChange(value-showPerPage,value);
  },[counter]);

  const onBUttonClick =(type)=>{
    if(type === 'prev'){
      if(counter ===1){
        setCounter(1);
      }else{
        setCounter(counter-1);
      }
    }else if(type === 'next'){
       if(Math.ceil(total/showPerPage)=== counter){
         setCounter(counter)
       }else {
         setCounter(counter+1);
       }
    }
          
  }
  return (
    <div>
      <Space>
      <Button
      
      type="primary"
       onClick={()=> onBUttonClick('prev')}> 
       Prev
       </Button>
      <Button type="primary" 
      onClick={()=> onBUttonClick('next')}>
         Next
         </Button>
      </Space>
    </div>
  )
}
export default Pagination;