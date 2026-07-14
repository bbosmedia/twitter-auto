/**
 * HeroUI + Tailwind entrypoint.
 *
 * Use HeroUI components for accessible UI primitives.
 * Style layout/spacing with Tailwind utilities via `className` + `cn()`.
 *
 * @example
 * import { Button, Card, TextField, Input, Label, cn } from "@/components/ui";
 *
 * <Card className={cn("card-premium", "w-full")}>
 *   <Card.Content className="flex flex-col gap-4 p-6">
 *     <TextField fullWidth className="form-field">
 *       <Label>Email</Label>
 *       <Input className="w-full" />
 *     </TextField>
 *     <Button className="btn-glow w-full">Save</Button>
 *   </Card.Content>
 * </Card>
 */

export { cn } from "@/lib/cn";

// Re-export HeroUI (React Aria + Tailwind-styled components)
export {
  Accordion,
  Alert,
  AlertDialog,
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  CheckboxGroup,
  Chip,
  CloseButton,
  ComboBox,
  DateField,
  DatePicker,
  Description,
  Disclosure,
  Drawer,
  Dropdown,
  EmptyState,
  ErrorMessage,
  FieldError,
  Fieldset,
  Form,
  Header,
  Input,
  InputGroup,
  InputOTP,
  Kbd,
  Label,
  Link,
  ListBox,
  Meter,
  Modal,
  NumberField,
  Pagination,
  Popover,
  ProgressBar,
  ProgressCircle,
  Radio,
  RadioGroup,
  ScrollShadow,
  SearchField,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Surface,
  Switch,
  SwitchGroup,
  Table,
  Tabs,
  Tag,
  TagGroup,
  TextArea,
  TextField,
  TimeField,
  Toast,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
} from "@heroui/react";
