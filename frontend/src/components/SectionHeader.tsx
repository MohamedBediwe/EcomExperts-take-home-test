import React from 'react'

interface IProps {
    text: string
}

const SectionHeader: React.FC<IProps> = ({text})  =>  {
  return (
    <p className='uppercase text-[10px] px-[15px] py-[4px] text-[#484848] tracking-widest'>{text}</p>
  )
}

export default SectionHeader