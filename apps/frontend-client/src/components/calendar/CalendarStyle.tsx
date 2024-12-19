import { InterviewEvent } from "@/utils/types/calendar";


export const eventStyleGetter = (event: InterviewEvent) => {
  return {
    style: {
      backgroundColor: '#FF9800',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    }
  };
};