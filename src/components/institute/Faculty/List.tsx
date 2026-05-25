import { Link } from "react-router-dom";
import { Plus, Mail, Phone, Users, BookOpen, Award,  ChevronLeft,
  ChevronRight,SquarePen ,ExternalLink} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {nameFormate,timeAgo} from "../../../lib/utils"


const List = ({data,openModalEdit}) => {

  return (
      <>
        {data?.map((f,i) => (
          <Card
           key={f?.full_name + i}
            className="shadow-sm hover:shadow-md transition-shadow border-border/60"
          >
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                  {f?.full_name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <Link
                  to={`/institute/faculty/${f?._id}`}
                  className="font-semibold text-foreground truncate hover:text-primary transition-colors block"
                >
                  {nameFormate(f?.full_name||'')}
                </Link>

                <p className="text-sm text-muted-foreground">
                  {f?.role||''}
                </p>
{/* 
                <Badge
                  variant="outline"
                  className="mt-1.5 bg-muted/50 text-muted-foreground border-border text-[10px]"
                >
                  {f?.dept}
                </Badge> */}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm py-3 border-t border-border/60">
                <div>
                {/*   <p className="text-xs text-muted-foreground">
                    Students
                  </p>

                  <p className="font-display text-lg font-bold text-foreground">
                    {f?.students}
                  </p> */}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Courses
                  </p>

                  <p className="font-display text-lg font-bold text-foreground">
                    {f?.courses_name?.length||0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                >
                  <Link
                    to={`/institute/faculty/${f?._id}`}
                  >
                   <ExternalLink className="h-3.5 w-3.5" /> View profile
                  </Link>
                </Button>

                  <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() =>{openModalEdit(f)}}
                >
                  <SquarePen className="h-3.5 w-3.5" /> Edit
                </Button>

                <Button variant="outline" size="icon" >
                   <a href={`mailto:${f?.email||''}`}>
                  <Mail className="h-3.5 w-3.5" />
                  </a>
                </Button>

                <Button variant="outline" size="icon" >
                  <a href={`tel:${f?.phone||''}`}>
                  <Phone className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </>
     
  );
};
export default List;
