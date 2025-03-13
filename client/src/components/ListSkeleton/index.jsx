import "./index.scss";
import Skeleton from "react-loading-skeleton";
export default function ListSkeleton({ count = 5 }) {
  return (
    <>
      <Skeleton
        containerClassName="list-skeleton"
        className="list-skeleton__item"
        enableAnimation={true}
        inline={true}
      />
      <Skeleton
        containerClassName="list-skeleton"
        className="list-skeleton__item"
        enableAnimation={true}
        count={count}
        inline={true}
      />
    </>
  );
}
