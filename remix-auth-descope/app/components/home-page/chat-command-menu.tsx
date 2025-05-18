import { Form, useActionData, useNavigation } from "@remix-run/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ActionData = 
  | { error: string; success?: never; imageUrl?: never; prompt?: never }
  | { error?: never; success: boolean; imageUrl?: string; prompt: string };

export default function ChatCommandMenu() {
  const actionData = useActionData<ActionData>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  
  // Type guards for actionData
  const hasError = actionData && 'error' in actionData
  
  return (
    <div className="bg-card rounded-xl p-6 w-full flex flex-col items-end">
      <Form method="post" className="space-y-4 w-full">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-sm font-medium">
            What image do you want to create?
          </label>
          <div className="flex gap-2">
            <Input 
              id="prompt" 
              name="prompt" 
              placeholder="Describe the image you want to generate..." 
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isSubmitting} className="rounded-lg">
              {isSubmitting ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
        {hasError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
            {actionData.error}
          </div>
        )}
      </Form>
    </div>
  )
}
