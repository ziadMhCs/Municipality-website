import CardNews from "../components/Card";
import { useState, ChangeEvent } from "react";
import { IEvents, INewsApi } from "@/interfaces";
import instance from '../api/instance'
import { Button } from '../components/ui/button';
import Alerting from '../components/Complaint/Alert';
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useQuery } from '@tanstack/react-query'
import { txtSlicer } from "../utils/functions";
import CardSkeleton from "../components/Skeleton/CardSkeleton";
import TabSkeleton from "../components/Skeleton/TabSkeleton";

interface IEventTabs {
  id: number,
  name: string,
}
const pagesize = 2;

const Events = () => {

  const { isLoading, error, data } = useQuery({
    queryKey: ['activityData'],
    queryFn: async () => {
      const eventRes = await instance.get('/activity')
      const tabRes = await instance.get('/activity-type');
      return { eventRes, tabRes }
    }
  })

  const tabs = data?.tabRes.data.data;
  const [activeTab, setActiveTab] = useState<number>(1);
  const handlActiveTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  let filteredEvents = data?.eventRes.data.data;
  if (activeTab !== 1) {
    filteredEvents = filteredEvents.filter((eveData: IEvents) => eveData.activity_type_id === activeTab);
  }
  const [Pag, setPag] = useState({
    from: 0,
    to: pagesize,
  });

  const handelPagination = (event: ChangeEvent<unknown>, page: number) => {
    console.log(event?"":null);
    const from = (page - 1) * pagesize;
    const to = (page - 1) * pagesize + pagesize;
    setPag({ ...Pag, from: from, to: to });
  };

  if (isLoading) return (
    <div className="my-10 container space-y-5">
      <div className="font-header md:text-3xl font-bold text-center text-primary">الفعاليات</div>
      <div className='flex items-center justify-center gap-4 my-3'>
        {Array.from({ length: 5 }).map((_, i) => <TabSkeleton key={i} />)}
      </div>
      {Array.from({length:5}).map((_,i)=><CardSkeleton key={i} />)}
    </div>
  )

  if (error) return <Alerting />

  return (
    <div className="my-10 container">
      <div className="font-header md:text-3xl font-bold text-center text-primary">الفعاليات</div>
      <div className='flex lg:justify-center items-center gap-3 overflow-x-scroll my-2' style={{ scrollbarColor: "transparent transparent" }}>
        {tabs.map((tab: IEventTabs) => (
          <Button key={tab.id}
            onClick={() => handlActiveTabClick(tab.id)}
            className={(activeTab === tab.id
              ? "active-button"
              : "disabled-button") + ' w-28 md:w-36 border-0 focus-visible:ring-0 py-1 text-primary hover:text-white bg-white hover:bg-primary md:text-lg'}>{txtSlicer(tab.name,12)}</Button>
        ))}
      </div>
      {filteredEvents.slice(Pag.from, Pag.to).map((news: IEvents) => (
        <CardNews news={news as INewsApi} key={news.id} />
      ))}
      <div className="flex justify-items-center justify-center	">
        <Stack spacing={1}>
          <Pagination
          siblingCount={0}
          boundaryCount={1}
            onChange={handelPagination}
            count={Math.ceil(filteredEvents.length / pagesize)}
            color="primary"
            shape="rounded"
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowForwardIcon, next: ArrowBackIcon }}
                {...item}
              />
            )}
          />
        </Stack>
      </div>
    </div>
  );
};

export default Events;
