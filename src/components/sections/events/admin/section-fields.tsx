"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  EventSection,
  FaqSection,
  FormField,
  HeroSection,
  ProblemsSection,
  RegisterSection,
  SpeakersSection,
  StatsSection,
  TakeawaysSection,
} from "@/lib/events/types";
import { Field, SelectInput, TextArea, TextInput } from "./inputs";

function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 font-numeric text-xs font-medium text-slate-600 hover:border-primary hover:text-primary"
    >
      <Plus className="size-3.5" />
      {label}
    </button>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-3 pr-10">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Hapus item"
        className="absolute top-2.5 right-2.5 rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="size-3.5" />
      </button>
      <p className="mb-2 font-numeric text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

/**
 * Field editors for every section type. The parent owns the section value;
 * this component only describes how each shape is edited.
 */
export function SectionFields({
  section,
  onChange,
}: {
  section: EventSection;
  onChange: (next: EventSection) => void;
}) {
  switch (section.type) {
    case "hero":
      return <HeroFields section={section} onChange={onChange} />;
    case "problems":
      return <ProblemsFields section={section} onChange={onChange} />;
    case "takeaways":
      return <TakeawaysFields section={section} onChange={onChange} />;
    case "speakers":
      return <SpeakersFields section={section} onChange={onChange} />;
    case "stats":
      return <StatsFields section={section} onChange={onChange} />;
    case "faq":
      return <FaqFields section={section} onChange={onChange} />;
    case "register":
      return <RegisterFields section={section} onChange={onChange} />;
  }
}

function HeroFields({
  section,
  onChange,
}: {
  section: HeroSection;
  onChange: (next: HeroSection) => void;
}) {
  const patch = (p: Partial<HeroSection>) => onChange({ ...section, ...p });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextInput
        label="Label atas (eyebrow)"
        value={section.eyebrow}
        onChange={(v) => patch({ eyebrow: v })}
        hint="Contoh: WEBINAR GRATIS · TOUR & TRAVEL"
        className="sm:col-span-2"
      />
      <TextInput
        label="Kutipan judul"
        value={section.quote}
        onChange={(v) => patch({ quote: v })}
        className="sm:col-span-2"
      />
      <TextArea
        label="Judul utama (H1)"
        value={section.headline}
        onChange={(v) => patch({ headline: v })}
        rows={2}
        className="sm:col-span-2"
      />
      <TextArea
        label="Deskripsi"
        value={section.body}
        onChange={(v) => patch({ body: v })}
        className="sm:col-span-2"
      />
      <TextInput
        label="Teks tombol CTA"
        value={section.ctaLabel}
        onChange={(v) => patch({ ctaLabel: v })}
      />
      <TextInput
        label="URL gambar hero"
        value={section.image}
        onChange={(v) => patch({ image: v })}
        placeholder="/images/events/… atau https://…"
      />
      <TextInput
        label="Teks alternatif gambar"
        value={section.imageAlt}
        onChange={(v) => patch({ imageAlt: v })}
        className="sm:col-span-2"
      />
    </div>
  );
}

function ProblemsFields({
  section,
  onChange,
}: {
  section: ProblemsSection;
  onChange: (next: ProblemsSection) => void;
}) {
  const patch = (p: Partial<ProblemsSection>) => onChange({ ...section, ...p });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
        <TextArea
          label="Intro (opsional)"
          value={section.intro}
          onChange={(v) => patch({ intro: v })}
          rows={2}
          className="sm:col-span-2"
        />
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          title="Masalah"
          onRemove={() =>
            patch({ items: section.items.filter((i) => i.id !== item.id) })
          }
        >
          <TextInput
            label="Ikon (emoji)"
            value={item.icon}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, icon: v } : i,
                ),
              })
            }
          />
          <TextInput
            label="Judul"
            value={item.title}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, title: v } : i,
                ),
              })
            }
          />
          <TextArea
            label="Isi"
            value={item.body}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, body: v } : i,
                ),
              })
            }
            className="sm:col-span-2"
          />
        </ItemCard>
      ))}
      <AddButton
        label="Tambah masalah"
        onClick={() =>
          patch({
            items: [...section.items, { id: localId("p"), icon: "", title: "", body: "" }],
          })
        }
      />
    </div>
  );
}

function TakeawaysFields({
  section,
  onChange,
}: {
  section: TakeawaysSection;
  onChange: (next: TakeawaysSection) => void;
}) {
  const patch = (p: Partial<TakeawaysSection>) => onChange({ ...section, ...p });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
        <TextArea
          label="Intro (opsional)"
          value={section.intro}
          onChange={(v) => patch({ intro: v })}
          rows={2}
          className="sm:col-span-2"
        />
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          title="Poin"
          onRemove={() =>
            patch({ items: section.items.filter((i) => i.id !== item.id) })
          }
        >
          <TextInput
            label="Judul"
            value={item.title}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, title: v } : i,
                ),
              })
            }
            className="sm:col-span-2"
          />
          <TextArea
            label="Isi"
            value={item.body}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, body: v } : i,
                ),
              })
            }
            className="sm:col-span-2"
          />
        </ItemCard>
      ))}
      <AddButton
        label="Tambah poin"
        onClick={() =>
          patch({
            items: [...section.items, { id: localId("t"), title: "", body: "" }],
          })
        }
      />
    </div>
  );
}

function SpeakersFields({
  section,
  onChange,
}: {
  section: SpeakersSection;
  onChange: (next: SpeakersSection) => void;
}) {
  const patch = (p: Partial<SpeakersSection>) => onChange({ ...section, ...p });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
        <TextArea
          label="Intro (opsional)"
          value={section.intro}
          onChange={(v) => patch({ intro: v })}
          rows={2}
          className="sm:col-span-2"
        />
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          title="Pembicara"
          onRemove={() =>
            patch({ items: section.items.filter((i) => i.id !== item.id) })
          }
        >
          <TextInput
            label="Nama"
            value={item.name}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, name: v } : i,
                ),
              })
            }
          />
          <TextInput
            label="Role / jabatan"
            value={item.role}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, role: v } : i,
                ),
              })
            }
          />
          <TextInput
            label="URL foto"
            value={item.photo}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, photo: v } : i,
                ),
              })
            }
            placeholder="/images/events/… atau https://…"
            className="sm:col-span-2"
          />
        </ItemCard>
      ))}
      <AddButton
        label="Tambah pembicara"
        onClick={() =>
          patch({
            items: [
              ...section.items,
              { id: localId("s"), name: "", role: "", photo: "" },
            ],
          })
        }
      />
    </div>
  );
}

function StatsFields({
  section,
  onChange,
}: {
  section: StatsSection;
  onChange: (next: StatsSection) => void;
}) {
  const patch = (p: Partial<StatsSection>) => onChange({ ...section, ...p });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          title="Statistik"
          onRemove={() =>
            patch({ items: section.items.filter((i) => i.id !== item.id) })
          }
        >
          <TextInput
            label="Angka (mis. +40%)"
            value={item.value}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, value: v } : i,
                ),
              })
            }
          />
          <TextInput
            label="Keterangan"
            value={item.label}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, label: v } : i,
                ),
              })
            }
          />
        </ItemCard>
      ))}
      <AddButton
        label="Tambah statistik"
        onClick={() =>
          patch({
            items: [...section.items, { id: localId("st"), value: "", label: "" }],
          })
        }
      />
    </div>
  );
}

function FaqFields({
  section,
  onChange,
}: {
  section: FaqSection;
  onChange: (next: FaqSection) => void;
}) {
  const patch = (p: Partial<FaqSection>) => onChange({ ...section, ...p });
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
      </div>
      {section.items.map((item) => (
        <ItemCard
          key={item.id}
          title="Pertanyaan"
          onRemove={() =>
            patch({ items: section.items.filter((i) => i.id !== item.id) })
          }
        >
          <TextInput
            label="Pertanyaan"
            value={item.question}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, question: v } : i,
                ),
              })
            }
            className="sm:col-span-2"
          />
          <TextArea
            label="Jawaban"
            value={item.answer}
            onChange={(v) =>
              patch({
                items: section.items.map((i) =>
                  i.id === item.id ? { ...i, answer: v } : i,
                ),
              })
            }
            className="sm:col-span-2"
          />
        </ItemCard>
      ))}
      <AddButton
        label="Tambah pertanyaan"
        onClick={() =>
          patch({
            items: [
              ...section.items,
              { id: localId("q"), question: "", answer: "" },
            ],
          })
        }
      />
    </div>
  );
}

function RegisterFields({
  section,
  onChange,
}: {
  section: RegisterSection;
  onChange: (next: RegisterSection) => void;
}) {
  const patch = (p: Partial<RegisterSection>) => onChange({ ...section, ...p });
  const patchField = (id: string, p: Partial<FormField>) =>
    patch({
      fields: section.fields.map((f) => (f.id === id ? { ...f, ...p } : f)),
    });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput label="Eyebrow" value={section.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <TextInput label="Judul section" value={section.heading} onChange={(v) => patch({ heading: v })} />
        <TextInput
          label="Kutipan di atas form"
          value={section.quote}
          onChange={(v) => patch({ quote: v })}
          className="sm:col-span-2"
        />
        <TextInput
          label="Teks tombol kirim"
          value={section.submitLabel}
          onChange={(v) => patch({ submitLabel: v })}
        />
        <TextInput
          label="Judul pesan sukses"
          value={section.successTitle}
          onChange={(v) => patch({ successTitle: v })}
        />
        <TextArea
          label="Isi pesan sukses"
          value={section.successBody}
          onChange={(v) => patch({ successBody: v })}
          rows={2}
          className="sm:col-span-2"
        />
        <TextArea
          label="Catatan kaki (disclaimer)"
          value={section.disclaimer}
          onChange={(v) => patch({ disclaimer: v })}
          rows={2}
          className="sm:col-span-2"
        />
      </div>

      <p className="pt-1 font-numeric text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Kolom form
      </p>
      {section.fields.map((field) => (
        <ItemCard
          key={field.id}
          title={`Kolom: ${field.label || field.name || "?"}`}
          onRemove={() =>
            patch({ fields: section.fields.filter((f) => f.id !== field.id) })
          }
        >
          <TextInput
            label="Label"
            value={field.label}
            onChange={(v) => patchField(field.id, { label: v })}
          />
          <TextInput
            label="Nama field (untuk sheet)"
            value={field.name}
            onChange={(v) =>
              patchField(field.id, { name: v.replace(/[^a-zA-Z0-9_]/g, "") })
            }
            hint="Huruf/angka/underscore saja"
          />
          <SelectInput
            label="Tipe"
            value={field.type}
            onChange={(v) => patchField(field.id, { type: v as FormField["type"] })}
            options={[
              { value: "text", label: "Teks" },
              { value: "email", label: "Email" },
              { value: "tel", label: "Telepon / WA" },
              { value: "select", label: "Pilihan (dropdown)" },
            ]}
          />
          <Field label="Wajib diisi">
            <label className="mt-1.5 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => patchField(field.id, { required: e.target.checked })}
                className="size-4 accent-[#1352bf]"
              />
              Wajib
            </label>
          </Field>
          {field.type === "select" && (
            <TextArea
              label="Pilihan (satu per baris)"
              value={field.options}
              onChange={(v) => patchField(field.id, { options: v })}
              className="sm:col-span-2"
            />
          )}
        </ItemCard>
      ))}
      <AddButton
        label="Tambah kolom"
        onClick={() =>
          patch({
            fields: [
              ...section.fields,
              {
                id: localId("f"),
                name: `field_${section.fields.length + 1}`,
                label: "",
                type: "text",
                required: false,
                options: "",
              },
            ],
          })
        }
      />
    </div>
  );
}
