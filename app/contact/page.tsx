import Form from 'app/components/ContactForm'

export const metadata = {
  title: 'Contact',
  description: 'Need help? Share your thoughts, suggestions, anything!',
}

export default function ContactPage() {
  return (
    <section>
      <div className="animate-in">
        <Form />
      </div>
    </section>
  )
}
