import CardNews from "../components/Card";
import { useState, ChangeEvent } from "react";
import { IDecisions, INewsApi } from "@/interfaces";
import instance from '../api/instance'
import Alerting from '../components/Complaint/Alert';
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useQuery } from '@tanstack/react-query'
import CardSkeleton from "../components/Skeleton/CardSkeleton";

const pagesize = 2;

const Decisions = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['decisionData'],
    queryFn: async () => {
      const { data } = await instance.get('/decision')
      return data.data
    }
  })

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
      {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  )

  if (error) return <Alerting />

  return (
    <div className="my-10 container">
      {data.slice(Pag.from, Pag.to).map((news: IDecisions) => (
        <CardNews modal={true} news={news as INewsApi} key={news.id} />
      ))}
      <div className="flex justify-items-center justify-center	">
        <Stack spacing={2}>
          <Pagination
            siblingCount={0}
            boundaryCount={1}
            onChange={handelPagination}
            count={Math.ceil(data.length / pagesize)}
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

export default Decisions;
