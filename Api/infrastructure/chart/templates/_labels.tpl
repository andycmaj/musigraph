{{/*
Create standard metadata labels for helm-managed deployments
*/}}
{{- define "api.standardLabels" -}}
app: {{ template "api.name" . }}
chart: {{ template "api.chart" . }}
release: {{ .Release.Name }}
heritage: {{ .Release.Service }}
{{- end -}}