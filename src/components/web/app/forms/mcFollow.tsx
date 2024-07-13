import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Event } from "react-big-calendar"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Rating } from "./rating"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  beginMC: z.boolean().default(false).optional(),
  endMC: z.boolean().default(false).optional(),
  notes: z.string().optional(),
  flow: z.number().nonnegative().max(5).optional(),
  symptoms: z.array(
    z.object({
      id: z.number(),
      level: z.number().nonnegative().max(5),
    })
  ),
  useCondom: z.boolean().default(false).optional(),
  hadOrgasm: z.boolean().default(false).optional(),
  count: z.coerce.number().nonnegative().optional(),
})

const symptoms = [
  {
    id: 1,
    emoji: "🥚",
    name: "Ovulation",
    level: 0,
  },
  {
    id: 2,
    emoji: "🍒",
    name: "Breast Sensitivity",
    level: 0,
  },
  {
    id: 3,
    emoji: "💥",
    name: "Pelvic Pain",
    level: 0,
  },
  {
    id: 4,
    emoji: "🪑",
    name: "Lower Back Pain",
    level: 0,
  },
  {
    id: 5,
    emoji: "🍓",
    name: "Acne",
    level: 0,
  },
  {
    id: 6,
    emoji: "😧",
    name: "Headache",
    level: 0,
  },
  {
    id: 7,
    emoji: "💨",
    name: "Bloating",
    level: 0,
  },
  {
    id: 8,
    emoji: "🧻",
    name: "Diarrhea",
    level: 0,
  },
  {
    id: 9,
    emoji: "💩",
    name: "Constipation",
    level: 0,
  },
  {
    id: 10,
    emoji: "🤮",
    name: "Nausea",
    level: 0,
  },
]

type McFollowProps = {
  addEvent: (obj: any) => void
  event?: Event & { id: number }
}

export default function McFollow({ addEvent, event }: McFollowProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beginMC: !event ? false : event.resource.beginMC,
      endMC: !event ? false : event.resource.endMC,
      flow: !event ? 0 : event.resource.flow,
      notes: !event ? "" : event.resource.notes,
      useCondom: !event ? false : event.resource.useCondom,
      hadOrgasm: !event ? false : event.resource.hadOrgasm,
      count: !event ? 0 : event.resource.count,
      symptoms: !event ? [] : event.resource.symptoms,
    },
  })

  const mySymptoms = symptoms.map((s) => {
    const ev = event?.resource.symptoms.find(
      (e: { id: number }) => s.id === e.id
    )

    return {
      ...s,
      level: !ev ? s.level : ev.level,
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (
      !(
        values.beginMC ||
        values.endMC ||
        values.notes ||
        values.symptoms.length > 0
      )
    ) {
      console.log(" vacio ")
      return
    }

    let title = values.beginMC ? "🩸" : ""
    for (let i = 0; i < values.symptoms.length; i++) {
      title +=
        symptoms.find((sy) => sy.id === values.symptoms[i].id)?.emoji || ""

      if (title.length === 6) break
    }

    const response = await fetch("/api/uploadIPFS", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const res = await response.json()
    const content = res.cid

    addEvent({
      id: event?.id,
      start: event?.start,
      title,
      content,
      resource: values,
    })
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:px-6 bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="beginMC"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Is the beginning of your Menstrual Cycle?
                  </FormLabel>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="flow"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                <div className="space-y-1 leading-none">
                  <FormLabel>Flow</FormLabel>
                </div>
                <FormControl>
                  <Rating
                    rating={field.value || 0}
                    totalStars={5}
                    size={16}
                    variant="yellow"
                    showText={false}
                    onRatingChange={(obj) => {
                      form.setValue("flow", obj.level)
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endMC"
            render={({ field }) => (
              <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                <div className="space-y-1 leading-none">
                  <FormLabel>Is the ending of your Menstrual Cycle?</FormLabel>
                </div>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Symtoms</AccordionTrigger>
              <AccordionContent>
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={() => (
                    <FormItem>
                      <ScrollArea className="h-48 rounded-md border">
                        <div className="px-4 py-2">
                          {mySymptoms.map(({ id, emoji, name, level }, idx) => (
                            <FormField
                              key={id}
                              control={form.control}
                              name="symptoms"
                              render={({ field }) => {
                                return (
                                  <FormItem key={id}>
                                    <FormControl
                                      className={cn(
                                        "flex justify-between transition-colors hover:bg-muted/50 py-1 align-middle items-center",
                                        idx === mySymptoms.length - 1
                                          ? "border-b-0"
                                          : "border-b"
                                      )}
                                    >
                                      <div key={id}>
                                        <div className="text-sm">
                                          {emoji} {name}
                                        </div>
                                        <Rating
                                          itemId={id}
                                          rating={level}
                                          totalStars={5}
                                          size={16}
                                          variant="yellow"
                                          showText={false}
                                          onRatingChange={(obj) => {
                                            if (obj.level === 0) {
                                              field.onChange(
                                                field.value?.filter(
                                                  ({ id }) => id !== obj.id
                                                )
                                              )
                                            } else
                                              field.onChange([
                                                ...field.value,
                                                obj,
                                              ])
                                          }}
                                        />
                                      </div>
                                    </FormControl>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Intercourse?</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                      <div className="space-y-1 leading-none">
                        <FormLabel>how many intercourse?</FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-16"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useCondom"
                  render={({ field }) => (
                    <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                      <div className="space-y-1 leading-none">
                        <FormLabel>Did you use condom?</FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hadOrgasm"
                  render={({ field }) => (
                    <FormItem className="flex flex-row justify-between space-x-3 space-y-0 ">
                      <div className="space-y-1 leading-none">
                        <FormLabel>Did you have orgasm?</FormLabel>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Si quieres registrar alguna otra información..."
                    className="resize-none"
                    {...field}
                  >
                    {field.value}
                  </Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
