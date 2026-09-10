import FixOnceChatWidget from '../../components/FixOnceChatWidget';

export const metadata = {
  title: 'Travel Assistance',
  description: 'Travel booking and reservation assistance.',
};

export default function WidgetPage() {
  return (
    <div className="fo-widget-only-page">
      <FixOnceChatWidget openOnMount />
    </div>
  );
}
